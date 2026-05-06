import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data } = await supabase.from('products').select('images').limit(1);
console.log(typeof data[0].images, Array.isArray(data[0].images), data[0].images);
