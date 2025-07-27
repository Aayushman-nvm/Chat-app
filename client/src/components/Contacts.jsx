import { UserCircle } from "lucide-react";

function Contacts({ setSelectedContact, onlineUsers, selectedContact, offlineUsers }) {

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold p-2">Contacts</h2>
      {onlineUsers.map((contact) => (
        <div
          key={contact.id}
          className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition ${selectedContact===contact?"border-l-amber-700 border-8":""}`}
          onClick={() => setSelectedContact(contact)}
        >
          <UserCircle className="mr-3 text-green-400" />
          <span className="text-base">{contact.name}</span>
        </div>
      ))}

      {offlineUsers.map((contact) => (
        <div
          key={contact._id}
          className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition ${selectedContact===contact?"border-l-amber-700 border-8":""}`}
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
