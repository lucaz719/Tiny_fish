-- Enable Row Level Security
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;

-- Review visibility: Public read for discovery, write restricted to buyer tenant
CREATE POLICY review_select_policy ON "reviews" FOR SELECT USING (true);
CREATE POLICY review_insert_policy ON "reviews" FOR INSERT WITH CHECK ("buyerId"::text = current_setting('app.current_tenant_id', TRUE));

-- Update Tenant policy to allow public discovery (SELECT)
DROP POLICY IF EXISTS tenant_isolation_policy ON "tenants";
CREATE POLICY tenant_public_discovery_policy ON "tenants" FOR SELECT USING (true);
CREATE POLICY tenant_write_isolation_policy ON "tenants" FOR UPDATE USING (id::text = current_setting('app.current_tenant_id', TRUE));