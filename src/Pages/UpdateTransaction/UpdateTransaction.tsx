import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";

// Fetch Single transaction Function
const fetchSingleTransaction = async (id: string) => {
  const response = await axiosInstance.get(`/transactions/${id}`);
  return response.data?.data;
};

const UpdateTransaction = () => {

  const [activeBtn, setActiveBtn] = useState(false);
    const {role} = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

  // TanStack Query
  const { data: transaction, isLoading, isError, error } = useQuery({
    queryKey: ["singleTransaction", id],
    queryFn: () => fetchSingleTransaction(id as string),
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
  const {mutate: transactionMutation} = useMutation({
    mutationFn: async(data: {amount: number; type: string, note?: string;}) => {
      const response = await axiosInstance.patch(`/transactions/${id}`, data)
      return response.data;
    },
    onSuccess: (data) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message});
      setTimeout(() => 
        {setActiveBtn(false)
          navigate(`/dashboard/singleTransaction/${id}`);
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
    const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value);
    const type = (form.elements.namedItem('type') as HTMLInputElement).value;
    const note = (form.elements.namedItem('note') as HTMLInputElement).value.trim() || undefined;

    // call tanstackQuery mutation
    setActiveBtn(true);
    transactionMutation({amount,type, note});

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
        <Link to="/dashboard/transactionTable" className="btn btn-outline btn-sm mt-4">Go Back</Link>
      </div>
    );
  }


  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center mb-2">Update Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Amount</span>
                  </label>
                  <div className="relative">
                    <input type="number" name="amount" defaultValue={transaction.amount} placeholder="enter your amount" className="input w-full" min="1" step="1" required/>
                  </div>
                </div>
                {/* type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">TransactionType</span>
                  </label>
                  <div className="relative">
                    <select name="type" defaultValue={transaction.type} className="select select-md w-full" required>
                      {role === "ADMIN" && <option value="INVESTMENT">INVESTMENT</option>}
                      <option value="INCOME">INCOME</option>
                      <option value="EXPENSE">EXPENSE</option>
                    </select>
                  </div>
                </div>
                {/* note */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Note</span>
                  </label>
                  <div className="relative">
                    <textarea name="note" defaultValue={transaction.note} placeholder="enter your note" className="textarea textarea-md w-full"></textarea>
                  </div>
                </div>
                {/* submit */}
                <div className="form-control flex mt-6 gap-1">
                  <button type="button" onClick={() => navigate(`/dashboard/singleTransaction/${id}`)} className="btn bg-rose-600 text-white w-1/2" >Back</button>
                  <button type="submit" className="btn bg-emerald-600 text-white w-1/2 "  disabled={activeBtn}>{activeBtn ? "Updated..." : "Update"}</button>
                </div>
              </form>
            </div>
          </div>
    </div>
  );
};

export default UpdateTransaction;