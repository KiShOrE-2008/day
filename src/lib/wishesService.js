import { supabase, isSupabaseConfigured, BUCKET_NAME } from './supabase';
import { compressImage, validateImageFile } from './imageCompressor';

// ----------------------------------------------------------------------
// SAMPLE MOCK WISHES FOR DEV FALLBACK MODE
// ----------------------------------------------------------------------
const INITIAL_MOCK_WISHES = [
  {
    id: 'mock-1',
    name: 'Rahul',
    relationship: 'Friend',
    message: 'Happy Birthday Miyaaaaww! ❤️ Wishing you all the joy, love, and laughter in the world today!',
    photo_path: null,
    approved: true,
    featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    approved_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Ananya',
    relationship: 'Best Friend',
    message: 'Happy Birthday Sowmiya! Stay crazy, keep smiling, and never stop inspiring everyone around you! ✨🎂',
    photo_path: null,
    approved: true,
    featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    approved_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'mock-3',
    name: 'SIH Teammate',
    relationship: 'SIH Team',
    message: 'To the absolute hackathon champ! 🏆 Happy Birthday Miyaaaaww! Hope this year brings huge wins!',
    photo_path: null,
    approved: true,
    featured: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    approved_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'mock-4',
    name: 'Priya',
    relationship: 'Cousin',
    message: 'Sending you warmest birthday hugs! Happy Birthday Sowmiya darling! ❤️🎉',
    photo_path: null,
    approved: false,
    featured: false,
    created_at: new Date().toISOString(),
    approved_at: null,
  },
];

// LocalStorage Helper for Dev Mode
const LOCAL_STORAGE_KEY = 'miyaaaaww_wishes_dev';

function getLocalWishes() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_WISHES));
    return INITIAL_MOCK_WISHES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MOCK_WISHES;
  }
}

function saveLocalWishes(wishes) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishes));
}

// ----------------------------------------------------------------------
// HELPER: GET PUBLIC URL FOR PHOTO
// ----------------------------------------------------------------------
export function getPhotoUrl(photo_path) {
  if (!photo_path) return null;
  if (photo_path.startsWith('data:') || photo_path.startsWith('http')) {
    return photo_path; // Local data URL or direct link
  }
  if (!isSupabaseConfigured() || !supabase) {
    return photo_path;
  }
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(photo_path);
  return data?.publicUrl || null;
}

// ----------------------------------------------------------------------
// 1. SUBMIT WISH
// ----------------------------------------------------------------------
export async function submitWish({ name, relationship, message, photoFile }) {
  // Validate text input
  const cleanName = (name || '').trim();
  const cleanRel = (relationship || '').trim();
  const cleanMsg = (message || '').trim();

  if (cleanName.length < 2 || cleanName.length > 80) {
    throw new Error('Name must be between 2 and 80 characters.');
  }

  if (cleanMsg.length < 5 || cleanMsg.length > 1000) {
    throw new Error('Message must be between 5 and 1000 characters.');
  }

  let photo_path = null;

  // Validate and compress photo if provided
  if (photoFile) {
    const val = validateImageFile(photoFile);
    if (!val.valid) {
      throw new Error(val.error);
    }
  }

  // --- LIVE SUPABASE BACKEND ---
  if (isSupabaseConfigured() && supabase) {
    if (photoFile) {
      const compressedBlob = await compressImage(photoFile);
      const fileExt = compressedBlob.type.includes('webp') ? 'webp' : 'jpg';
      const fileName = `wishes/${crypto.randomUUID()}.${fileExt}`;

      // Step 1: Upload compressed photo to Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, compressedBlob, {
          contentType: compressedBlob.type,
          upsert: false,
        });

      if (uploadErr) {
        console.error('Storage upload error:', uploadErr);
        throw new Error('Failed to upload photo. Please try again.');
      }

      photo_path = fileName;
    }

    // Step 2: Insert wish record into database
    const { data: insertedData, error: dbErr } = await supabase
      .from('birthday_wishes')
      .insert([
        {
          name: cleanName,
          relationship: cleanRel || null,
          message: cleanMsg,
          photo_path,
          approved: false,
          featured: false,
        },
      ])
      .select();

    if (dbErr) {
      console.error('DB Insert error:', dbErr);
      // Clean up orphaned image if DB insert failed
      if (photo_path) {
        await supabase.storage.from(BUCKET_NAME).remove([photo_path]).catch(() => {});
      }
      throw new Error('Failed to save your wish. Please try again.');
    }

    return insertedData[0];
  }

  // --- DEV LOCALSTORAGE FALLBACK ---
  let localPhotoData = null;
  if (photoFile) {
    const compressedBlob = await compressImage(photoFile);
    localPhotoData = await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.readAsDataURL(compressedBlob);
    });
  }

  const newWish = {
    id: `local-${Date.now()}`,
    name: cleanName,
    relationship: cleanRel || null,
    message: cleanMsg,
    photo_path: localPhotoData,
    approved: false,
    featured: false,
    created_at: new Date().toISOString(),
    approved_at: null,
  };

  const list = getLocalWishes();
  list.unshift(newWish);
  saveLocalWishes(list);

  return newWish;
}

// ----------------------------------------------------------------------
// 2. FETCH APPROVED WISHES (FOR PUBLIC WALL & STORY)
// ----------------------------------------------------------------------
export async function fetchApprovedWishes() {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('birthday_wishes')
      .select('*')
      .eq('approved', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch approved wishes error:', error);
      throw new Error('Failed to fetch birthday wishes.');
    }
    return data || [];
  }

  // Local fallback
  const list = getLocalWishes();
  return list
    .filter((w) => w.approved)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.created_at) - new Date(a.created_at));
}

// ----------------------------------------------------------------------
// 3. FETCH FEATURED WISHES (FOR HOMEPAGE STORY SECTION)
// ----------------------------------------------------------------------
export async function fetchFeaturedWishes(limit = 8) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('birthday_wishes')
      .select('*')
      .eq('approved', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Fetch featured wishes error:', error);
      return [];
    }

    // Fall back to general approved wishes if no featured ones exist yet
    if (!data || data.length === 0) {
      const { data: fallbackData } = await supabase
        .from('birthday_wishes')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      return fallbackData || [];
    }

    return data;
  }

  // Local fallback
  const list = getLocalWishes();
  const featured = list.filter((w) => w.approved && w.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return list.filter((w) => w.approved).slice(0, limit);
}

// ----------------------------------------------------------------------
// 4. FETCH ALL WISHES (FOR ADMIN DASHBOARD)
// ----------------------------------------------------------------------
export async function fetchAllWishes() {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('birthday_wishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch all wishes error:', error);
      throw new Error('Failed to fetch wishes list for admin.');
    }
    return data || [];
  }

  // Local fallback
  return getLocalWishes();
}

// ----------------------------------------------------------------------
// 5. APPROVE WISH (ADMIN)
// ----------------------------------------------------------------------
export async function approveWish(id) {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('birthday_wishes')
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Approve wish error:', error);
      throw new Error('Failed to approve wish.');
    }
    return true;
  }

  // Local fallback
  const list = getLocalWishes();
  const idx = list.findIndex((w) => w.id === id);
  if (idx !== -1) {
    list[idx].approved = true;
    list[idx].approved_at = new Date().toISOString();
    saveLocalWishes(list);
  }
  return true;
}

// ----------------------------------------------------------------------
// 6. REJECT & DELETE WISH (ADMIN)
// ----------------------------------------------------------------------
export async function rejectWish(id) {
  if (isSupabaseConfigured() && supabase) {
    // Check if wish has a photo to clean up
    const { data } = await supabase.from('birthday_wishes').select('photo_path').eq('id', id).single();
    if (data?.photo_path) {
      await supabase.storage.from(BUCKET_NAME).remove([data.photo_path]).catch(() => {});
    }

    const { error } = await supabase.from('birthday_wishes').delete().eq('id', id);
    if (error) {
      console.error('Reject wish error:', error);
      throw new Error('Failed to delete wish.');
    }
    return true;
  }

  // Local fallback
  const list = getLocalWishes().filter((w) => w.id !== id);
  saveLocalWishes(list);
  return true;
}

// ----------------------------------------------------------------------
// 7. EDIT WISH (ADMIN)
// ----------------------------------------------------------------------
export async function editWish(id, updates) {
  const cleanName = (updates.name || '').trim();
  const cleanRel = (updates.relationship || '').trim();
  const cleanMsg = (updates.message || '').trim();

  if (cleanName.length < 2) throw new Error('Name is required.');
  if (cleanMsg.length < 5) throw new Error('Message is required.');

  const patch = {
    name: cleanName,
    relationship: cleanRel || null,
    message: cleanMsg,
    featured: Boolean(updates.featured),
    approved: Boolean(updates.approved),
    updated_at: new Date().toISOString(),
  };

  if (patch.approved && !updates.approved_at) {
    patch.approved_at = new Date().toISOString();
  }

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('birthday_wishes').update(patch).eq('id', id);
    if (error) {
      console.error('Edit wish error:', error);
      throw new Error('Failed to update wish.');
    }
    return true;
  }

  // Local fallback
  const list = getLocalWishes();
  const idx = list.findIndex((w) => w.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...patch };
    saveLocalWishes(list);
  }
  return true;
}

// ----------------------------------------------------------------------
// 8. TOGGLE FEATURED WISH (ADMIN)
// ----------------------------------------------------------------------
export async function toggleFeaturedWish(id, featuredState) {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('birthday_wishes')
      .update({ featured: featuredState, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Toggle featured error:', error);
      throw new Error('Failed to update featured state.');
    }
    return true;
  }

  // Local fallback
  const list = getLocalWishes();
  const idx = list.findIndex((w) => w.id === id);
  if (idx !== -1) {
    list[idx].featured = featuredState;
    saveLocalWishes(list);
  }
  return true;
}

// ----------------------------------------------------------------------
// 9. ADMIN AUTHENTICATION
// ----------------------------------------------------------------------
export async function signInAdmin(email, password) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message || 'Invalid admin credentials.');
    }
    return data.session;
  }

  // Dev fallback mode auth check
  if (email === 'admin@miyaaaaww.com' || password === 'admin123') {
    const devSession = {
      user: { id: 'dev-admin-id', email: 'admin@miyaaaaww.com' },
      access_token: 'dev-token',
    };
    sessionStorage.setItem('dev_admin_session', JSON.stringify(devSession));
    return devSession;
  }
  throw new Error('Invalid dev admin login. (Try admin@miyaaaaww.com / admin123)');
}

export async function signOutAdmin() {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }
  sessionStorage.removeItem('dev_admin_session');
}

export async function getAdminSession() {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  }

  const dev = sessionStorage.getItem('dev_admin_session');
  if (dev) {
    try {
      return JSON.parse(dev);
    } catch {
      return null;
    }
  }
  return null;
}
