-- Allow authenticated users to insert/update/delete product_tags
CREATE POLICY "Authenticated users can manage product_tags" ON public.product_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
