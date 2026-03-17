import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const statements = [
    `ALTER TABLE "pos_sessions" ENABLE ROW LEVEL SECURITY;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'pos_session_isolation_policy') THEN
        CREATE POLICY pos_session_isolation_policy ON "pos_sessions"
        FOR ALL
        USING (
          ("tenantId"::text = current_setting('app.current_tenant_id', TRUE))
          OR 
          (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
        );
      END IF;
    END $$;`,
    `ALTER TABLE "pos_transactions" ENABLE ROW LEVEL SECURITY;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'pos_transaction_isolation_policy') THEN
        CREATE POLICY pos_transaction_isolation_policy ON "pos_transactions"
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM "pos_sessions" s
            WHERE s.id = "sessionId"
            AND s."tenantId"::text = current_setting('app.current_tenant_id', TRUE)
          )
          OR 
          (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
        );
      END IF;
    END $$;`,
    `ALTER TABLE "pos_transaction_items" ENABLE ROW LEVEL SECURITY;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'pos_transaction_item_isolation_policy') THEN
        CREATE POLICY pos_transaction_item_isolation_policy ON "pos_transaction_items"
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM "pos_transactions" t
            JOIN "pos_sessions" s ON s.id = t."sessionId"
            WHERE t.id = "transactionId"
            AND s."tenantId"::text = current_setting('app.current_tenant_id', TRUE)
          )
          OR 
          (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
        );
      END IF;
    END $$;`,
    `ALTER TABLE "price_benchmarks" ENABLE ROW LEVEL SECURITY;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'price_benchmark_read_policy') THEN
        CREATE POLICY price_benchmark_read_policy ON "price_benchmarks"
        FOR SELECT
        USING (true);
      END IF;
    END $$;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'price_benchmark_write_policy') THEN
        CREATE POLICY price_benchmark_write_policy ON "price_benchmarks"
        FOR ALL
        USING (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN');
      END IF;
    END $$;`,
    `ALTER TABLE "rfqs" ENABLE ROW LEVEL SECURITY;`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'rfq_isolation_policy') THEN
        CREATE POLICY rfq_isolation_policy ON "rfqs"
        FOR ALL
        USING (
          ("buyerId"::text = current_setting('app.current_tenant_id', TRUE))
          OR 
          ("sellerId"::text = current_setting('app.current_tenant_id', TRUE))
          OR 
          (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
        );
      END IF;
    END $$;`
  ];

  for (const sql of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('Applied:', sql.trim().split('\\n')[0].substring(0, 50) + '...');
    } catch (err) {
      console.error('Error in statement:', sql);
      console.error(err);
      process.exit(1);
    }
  }
  console.log('All RLS policies applied successfully.');
  await prisma.$disconnect();
}

main();
