/**
 * Native IndexedDB storage wrapper for Cosplay Planner Moodboards.
 * Avoids localStorage 5MB quota limits by storing image blobs directly in IndexedDB.
 */

export interface MoodboardImage {
  id: string;
  projectId: string;
  dataUrl: string;
  caption?: string;
  width: number;
  height: number;
  sizeBytes: number;
  createdAt: string;
}

const DB_NAME = 'cosplay_planner_moodboard_db';
const DB_VERSION = 1;
const STORE_NAME = 'moodboard_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('projectId', 'projectId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Downscales an image File to max 1600px width/height and returns dataUrl and dimensions.
 */
export async function downscaleImage(file: File, maxDimension: number = 1600): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        const approximateBytes = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          width,
          height,
          sizeBytes: approximateBytes
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getProjectImages(projectId: string): Promise<MoodboardImage[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('projectId');
      const request = index.getAll(projectId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load moodboard images from IndexedDB', err);
    return [];
  }
}

export async function addProjectImage(
  projectId: string,
  dataUrl: string,
  width: number,
  height: number,
  sizeBytes: number,
  caption?: string
): Promise<MoodboardImage> {
  const db = await openDB();
  const image: MoodboardImage = {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    projectId,
    dataUrl,
    caption: caption || '',
    width,
    height,
    sizeBytes,
    createdAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(image);

    request.onsuccess = () => resolve(image);
    request.onerror = () => reject(request.error);
  });
}

export async function updateImageCaption(id: string, caption: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const img = getReq.result as MoodboardImage;
      if (img) {
        img.caption = caption;
        store.put(img);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function deleteProjectImage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearProjectImages(projectId: string): Promise<void> {
  const db = await openDB();
  const images = await getProjectImages(projectId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const img of images) {
      store.delete(img.id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTotalStorageBytes(): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const all = (request.result as MoodboardImage[]) || [];
        const total = all.reduce((sum, it) => sum + (it.sizeBytes || 0), 0);
        resolve(total);
      };
      request.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}
