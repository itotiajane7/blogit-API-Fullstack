// src/pages/Profile.tsx
const Profile = () => {
  const user = {
    firstName: "Jane",
    lastName: "Wanjiku",
    username: "jane123",
    emailAddress: "jane@example.com",
    dateJoined: new Date().toISOString(),
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Profile Page</h1>
      <div className="space-y-2">
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.emailAddress}</p>
        <p><strong>Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;
