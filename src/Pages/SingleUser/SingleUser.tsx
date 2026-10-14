import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

// Fetch Single User Function
const fetchSingleUser = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data?.data;
};

const SingleUser = () => {
  const { id } = useParams<{ id: string }>();

  // tanstack query
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["singleUser", id],
    queryFn: () => fetchSingleUser(id as string),
    enabled: !!id,
  });


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{(error as any)?.response?.data?.message || "Failed to load user details!"}</p>
        <Link to="/dashboard/users" className="btn btn-outline btn-sm mt-4">
          Go Back
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto my-6 p-4">
      {

      isLoading ? (
        <div className="text-center py-10 font-medium text-gray-500">
          Loading user details...
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-error font-medium">
          Error loading user details!
        </div>
      ):(<div className="card flex-col sm:flex-row bg-base-100 shadow-sm border border-base-200 overflow-hidden">
        
        {/* Profile Image Section (Responsive) */}
        <figure className="w-full sm:w-1/3 h-64 sm:h-auto shrink-0 bg-base-200">
          <img src={user?.profileImage || '/empty-person.png'} alt={user?.name || "User Profile"} className="w-full h-full object-cover"
          />
        </figure>

        {/* User Details Section */}
        <div className="card-body w-full sm:w-2/3">
          {/* Name & Role */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title text-md font-bold text-gray-800 dark:text-white">
              {user?.name || "N/A"}
            </h2>
            <div className={`badge ${
              user?.role === 'ADMIN' ? 'badge-error text-white' : 
              user?.role === 'MODERATOR' ? 'badge-warning text-white' : 'badge-neutral'
            }`}>{user?.role}
            </div>
          </div>

          {/* Email */}
          <p className="text-gray-600 text-md font-medium">{user?.email}</p>

          <div className="divider my-1"></div>

          {/* Additional Info Data */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status:</span>
              <span className={`badge badge-sm font-semibold ${
                user?.status === 'APPROVED' ? 'badge-success text-white' : 
                user?.status === 'PENDING' ? 'badge-warning text-white' : 'badge-error text-white'
              }`}>
                {user?.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold">Joined At:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold">Last Updated:</span>
              <span>{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="card-actions justify-end mt-4">
            <Link to="/dashboard/usersTable">
              <button className="btn bg-rose-600 text-white btn-sm">Back</button>
            </Link>
          </div>

        </div>
      </div>)
      }
    </div>
  );
};

export default SingleUser;