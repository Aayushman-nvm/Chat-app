import { UserCircle, Users, Wifi, WifiOff } from "lucide-react";

function Contacts({ setSelectedContact, onlineUsers, selectedContact, offlineUsers }) {
  const getSelectedId = (contact) => contact?.id || contact?._id;
  const selectedId = getSelectedId(selectedContact);

  const isSelected = (contact) => {
    const contactId = getSelectedId(contact);
    return contactId === selectedId;
  };

  return (
    <div className="p-4 space-y-1">
      {/* Online Users Section */}
      {onlineUsers && onlineUsers.length > 0 && (
        <>
          <div className="flex items-center space-x-2 mb-3">
            <Wifi className="text-green-400" size={16} />
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">
              Online ({onlineUsers.length})
            </h3>
          </div>
          
          {onlineUsers.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative
                ${isSelected(contact) 
                  ? "bg-blue-600 shadow-lg" 
                  : "hover:bg-gray-700"
                }`}
              onClick={() => setSelectedContact(contact)}
            >
              {/* Selection Indicator */}
              {isSelected(contact) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
              )}
              
              <div className="relative">
                <UserCircle 
                  className={`mr-3 ${isSelected(contact) ? "text-white" : "text-green-400"}`} 
                  size={20} 
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isSelected(contact) ? "text-white" : "text-gray-200"
                }`}>
                  {contact.name}
                </p>
                <p className={`text-xs ${
                  isSelected(contact) ? "text-blue-200" : "text-green-400"
                }`}>
                  Online
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Offline Users Section */}
      {offlineUsers && offlineUsers.length > 0 && (
        <>
          <div className="flex items-center space-x-2 mb-3 mt-6">
            <WifiOff className="text-gray-400" size={16} />
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Offline ({offlineUsers.length})
            </h3>
          </div>
          
          {offlineUsers.map((contact) => (
            <div
              key={contact._id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative
                ${isSelected(contact) 
                  ? "bg-blue-600 shadow-lg" 
                  : "hover:bg-gray-700"
                }`}
              onClick={() => setSelectedContact(contact)}
            >
              {/* Selection Indicator */}
              {isSelected(contact) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
              )}
              
              <div className="relative">
                <UserCircle 
                  className={`mr-3 ${isSelected(contact) ? "text-white" : "text-gray-400"}`} 
                  size={20} 
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 border-2 border-gray-800 rounded-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isSelected(contact) ? "text-white" : "text-gray-200"
                }`}>
                  {contact.name}
                </p>
                <p className={`text-xs ${
                  isSelected(contact) ? "text-blue-200" : "text-gray-400"
                }`}>
                  Offline
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Empty State */}
      {(!onlineUsers || onlineUsers.length === 0) && (!offlineUsers || offlineUsers.length === 0) && (
        <div className="text-center py-8">
          <Users className="mx-auto text-gray-600 mb-3" size={32} />
          <p className="text-gray-500 text-sm">No contacts available</p>
          <p className="text-gray-600 text-xs mt-1">
            Contacts will appear here when available
          </p>
        </div>
      )}
    </div>
  );
}

export default Contacts;