-- Enable Row Level Security
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Create Policies for Tenants
CREATE POLICY tenant_isolation_policy ON "tenants"
FOR ALL
USING (
  (id::text = current_setting('app.current_tenant_id', TRUE))
  OR 
  (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
);

-- Create Policies for Users
CREATE POLICY user_isolation_policy ON "users"
FOR ALL
USING (
  ("tenantId"::text = current_setting('app.current_tenant_id', TRUE))
  OR 
  (current_setting('app.user_role', TRUE) = 'SUPER_ADMIN')
);