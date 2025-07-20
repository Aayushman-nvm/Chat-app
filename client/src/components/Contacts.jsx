import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";

function Contacts({ setSelectedContact }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // TODO: Fetch contacts from your backend here
    setContacts([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ]);
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold p-2">Contacts</h2>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition"
          onClick={() => setSelectedContact(contact)}
        >
          <UserCircle className="mr-3 text-gray-400" />
          <span className="text-base">{contact.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Contacts;
