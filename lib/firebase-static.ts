import { adminDb } from './firebase-admin';

export const getStaticFirestoreData = async (
  collectionName: string,
  tenant?: string
): Promise<Array<{ id: string; [key: string]: any }>> => {
  try {
    if (!adminDb) throw new Error('Firestore Admin not initialized');
    let ref;
    if (tenant) {
      // For multi-tenant data
      ref = adminDb.collection(`tenants/${tenant}/${collectionName}`);
    } else {
      // For global data
      ref = adminDb.collection(collectionName);
    }
    const snapshot = await ref.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};
