-- CreateIndex
CREATE INDEX "batches_productId_idx" ON "batches"("productId");

-- CreateIndex
CREATE INDEX "batches_status_idx" ON "batches"("status");

-- CreateIndex
CREATE INDEX "batches_expiryDate_idx" ON "batches"("expiryDate");

-- CreateIndex
CREATE INDEX "inventory_tenantId_idx" ON "inventory"("tenantId");

-- CreateIndex
CREATE INDEX "inventory_productId_idx" ON "inventory"("productId");

-- CreateIndex
CREATE INDEX "orders_buyerTenantId_idx" ON "orders"("buyerTenantId");

-- CreateIndex
CREATE INDEX "orders_sellerTenantId_idx" ON "orders"("sellerTenantId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_tenantId_idx" ON "products"("tenantId");
