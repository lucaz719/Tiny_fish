-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
