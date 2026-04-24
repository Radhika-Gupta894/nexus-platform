import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/config";

export const checkDuplicate = async (newReport) => {
  const snapshot = await getDocs(
    collection(db, "reports")
  );

  const reports = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const duplicate = reports.find((r) =>
    r.location?.toLowerCase() === newReport.location.toLowerCase() &&
    r.type?.toLowerCase() === newReport.type.toLowerCase()
  );

  return duplicate || null;
};