import { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";

// Fetch Single Category Function
const fetchSingleCategory = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data?.data;
};

const UpdateCategory = () => {

  const [activeBtn, setActiveBtn] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TanStack Query
  const { data: category, isLoading, isError, error } = useQuery({
    queryKey: ["singleCategory", id],
    queryFn: () => fetchSingleCategory(id as string),
    enabled: !!id,
  });

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });

  // call mutation
  const {mutate: categoryMutation} = useMutation({
    mutationFn: async(data: {name: string; description?: string;}) => {
      const response = await axiosInstance.patch(`/categories/${id}`, data)
      return response.data;
    },
    onSuccess: (data) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message});
      setTimeout(() => {
        setActiveBtn(false);
        navigate(`/dashboard/singleCategory/${id}`);
      }, 1500);
    },
    onError: (error: any) => {
      // show toast
    Toast.fire({ icon: "error", title: error.response?.data?.message || error.message});
    setTimeout(() => {setActiveBtn(false)}, 1500);
    }
  })


  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>):Promise<void> => {

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value.trim() || undefined;

    // call tanstackQuery mutation
    setActiveBtn(true);
    categoryMutation({name,description});

  }

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
        <p>{(error as any)?.response?.data?.message || "Failed to load category details!"}</p>
        <Link to="/dashboard/singleCategory" className="btn btn-outline btn-sm mt-4">
          Go Back
        </Link>
      </div>
    );
  }



  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center mb-2">Create Category</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Name</span>
                  </label>
                  <div className="relative">
                    <input type="text" name="name" defaultValue={category?.name} placeholder="enter your category name" className="input w-full" required/>
                  </div>
                </div>
                {/* description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <div className="relative">
                    <textarea name="description" defaultValue={category?.description || ""} placeholder="enter your description" className="textarea textarea-md w-full"></textarea>
                  </div>
                </div>
                {/* submit */}
                <div className="form-control flex mt-6 gap-1">
                  <button type="button" onClick={() => navigate(`/dashboard/singleCategory/${id}`)} className="btn bg-rose-600 text-white w-1/2" >Back</button>
                  <button type="submit" className="btn bg-emerald-600 text-white w-1/2 "  disabled={activeBtn}>{activeBtn ? "Updated..." : "Update"}</button>
                </div>
              </form>
            </div>
          </div>
    </div>
  );
};

export default UpdateCategory;