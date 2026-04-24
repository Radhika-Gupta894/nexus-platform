import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const assignVolunteer = async (report) => {
  const snapshot = await getDocs(collection(db, "volunteers"));

  const volunteers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  const reportLocation = (report.location || "").toLowerCase().trim();
  const reportType = (report.type || "").toLowerCase().trim();

  const match = volunteers.find((v) => {
    const vLocation = (v.location || "").toLowerCase().trim();
    const vSkill = (v.skill || "").toLowerCase().trim();

    return (
      v.available === true &&
      vLocation === reportLocation &&
      vSkill === reportType
    );
  });

  return match || null;
};