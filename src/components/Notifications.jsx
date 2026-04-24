import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const Notifications = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(
            (r) =>
              r.assignedTo === user.displayName &&
              r.status === "Pending"
          );

        setAlerts(data);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "20px",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer"
        }}
      >
        🔔 {alerts.length > 0 && `(${alerts.length})`}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "300px",
            background: "white",
            color: "black",
            borderRadius: "12px",
            padding: "15px",
            zIndex: 1000
          }}
        >
          <h4>Notifications</h4>

          {alerts.length === 0 ? (
            <p>No new alerts</p>
          ) : (
            alerts.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd"
                }}
              >
                <b>{item.type}</b>
                <p>{item.location}</p>
                <small>New Task Assigned</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;