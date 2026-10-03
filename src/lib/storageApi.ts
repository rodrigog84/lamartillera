import { supabase } from './supabase';

const BUCKET = 'auction-files';

export type UploadFolder = 'images' | 'docs';

export async function uploadFile(
  file: File,
  folder: UploadFolder,
  auctionId: string,
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${auctionId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  // Extraer el path relativo desde la URL pública
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);

  await supabase.storage.from(BUCKET).remove([path]);
}
