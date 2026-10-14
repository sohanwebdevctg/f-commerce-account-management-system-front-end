import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../Context/AuthContext";


const CreateTransaction = () => {

  const [activeBtn, setActiveBtn] = useState(false);
  const {role, id, token, email} = useAuth();

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
      const response = await axiosInstance.post('/transactions', data)
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
    const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value);
    const type = (form.elements.namedItem('type') as HTMLInputElement).value;
    const note = (form.elements.namedItem('note') as HTMLInputElement).value.trim() || undefined;

    // call tanstackQuery mutation
    setActiveBtn(true);
    transactionMutation({amount,type, note});
    form.reset();

  }


  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center mb-2">Create Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Amount</span>
                  </label>
                  <div className="relative">
                    <input type="number" name="amount" placeholder="enter your amount" className="input w-full" min="1" step="1" required/>
                  </div>
                </div>
                {/* type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">TransactionType</span>
                  </label>
                  <div className="relative">
                    <select name="type" defaultValue="" className="select select-md w-full" required>
                      <option value="" disabled>Select Transaction</option>
                      {role === "ADMIN" && id && email && token && (<option value="INVESTMENT">INVESTMENT</option>)}
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
                    <textarea name="note" placeholder="enter your note" className="textarea textarea-md w-full"></textarea>
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

export default CreateTransaction;