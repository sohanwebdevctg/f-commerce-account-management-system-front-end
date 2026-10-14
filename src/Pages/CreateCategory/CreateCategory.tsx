import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";



const CreateCategory = () => {

  const [activeBtn, setActiveBtn] = useState(false);


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
    mutationFn: async(data: {name: string; description?: string; status: string}) => {
      const response = await axiosInstance.post('/categories', data)
      return response.data;
    },
    onSuccess: (data) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message});
      setTimeout(() => {setActiveBtn(false)}, 1500);
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
    const status = (form.elements.namedItem('status') as HTMLInputElement).value;

    // call tanstackQuery mutation
    setActiveBtn(true);
    categoryMutation({name,description, status});
    form.reset();

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
                    <input type="text" name="name" placeholder="enter your category name" className="input w-full" required/>
                  </div>
                </div>
                {/* description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <div className="relative">
                    <textarea name="description" placeholder="enter your description" className="textarea textarea-md w-full"></textarea>
                  </div>
                </div>

                {/* status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <div className="relative">
                    <select name="status" defaultValue="ACTIVE" className="select select-md w-full">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
                {/* submit */}
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full"  disabled={activeBtn}>{activeBtn ? "Created..." : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
    </div>
  );
};

export default CreateCategory;