-- Allow anyone to view product_tags (necessary for displaying tags on public products and admin lists)
CREATE POLICY "Anyone can view product_tags" ON public.product_tags FOR SELECT USING (true);
