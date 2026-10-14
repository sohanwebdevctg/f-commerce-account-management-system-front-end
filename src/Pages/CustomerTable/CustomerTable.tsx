import { useState } from "react";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";

// get all customers data
const getAllCustomers = async ( searchTerm: string, selectedType: string) => {
  const response = await axiosInstance.get(`/customers?searchTerm=${searchTerm}&type=${selectedType}`);
  return response.data;
};

// update customer type status
const updateCustomerStatus = async ({ id, customerType }: { id: string; customerType: string }) => {
  const response = await axiosInstance.patch(`/customers/${id}/status`, { customerType });
  return response.data;
};

const CustomerTable = () => {

  // search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const {role, id, token, email} = useAuth();

  // SweetAlert Toast Notification Config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });

  // TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", searchTerm, selectedType],
    queryFn: () => getAllCustomers(searchTerm, selectedType),
  });

  // Status Update Mutation
  const queryClient = useQueryClient();
const { mutate: updateCustomerStatusMutation } = useMutation({
  mutationFn: updateCustomerStatus,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    Toast.fire({ icon: "success", title: data?.message || "Customer status updated successfully!" });
  },
  onError: (error: any) => {
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update status!" });
  },
});

  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
        {/* Search & Tab Filters Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input (Mobile = full width, SM = auto/w-72) */}
        <div className="w-full lg:w-80">
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search by name or number..." className="input input-bordered input-sm w-full focus:outline-none"/>
        </div>
        {/* search and status */}
        <div className="flex justify-between items-center gap-2 p-1 w-full sm:w-auto">
          <button className="btn bg-red-500 btn-sm text-white w-1/2 lg:w-auto" onClick={() => {setSearchTerm(""); setSelectedType("")}}>Reset</button>
              {/* customerStatus */}
          <div className="flex flex-col -mt-3.5 w-full">
            <span className="text-xs font-semibold mb-0.5">Customer Status</span>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="select select-bordered select-sm w-full">
                <option value="">All</option>
                <option value="REGULAR">REGULAR</option>
                <option value="VIP">VIP</option>
                <option value="FRAUD_RISK">FRAUD_RISK</option>
              </select>
          </div>

        </div>
      </div>
    
      {/* Table Container */}
        <div className="overflow-x-auto w-full rounded-xl border border-base-200">
            <table className="table w-full bg-base-100">
              {/* Table Head */}
              <thead className="bg-base-200/50 text-base-content/70 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="overflow-x-scroll overflow-y-scroll">
                {
                  isLoading ? (<tr>
          <td colSpan={9} className="text-center py-6">
            Loading transactions...
          </td>
        </tr>) : isError ? (
        <tr>
          <td colSpan={9} className="text-center py-6 text-error">
            Error loading transactions!
          </td>
        </tr>
      ) : data?.data?.length === 0 ? (
        <tr>
          <td colSpan={9} className="text-center py-6 text-gray-500 font-medium">No Customers found! <span className="text-red-500">Please Reset</span>
          </td>
        </tr>
      ) : (data?.data?.map((customer: any, index: number) => (
      <tr key={customer.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
        <td className="font-semibold text-sm">{index + 1}</td>
        {/* Name */}
        <td className="font-semibold text-sm">{customer.name}</td>
        {/* Email */}
        <td className="font-semibold text-sm">{customer.email}</td>
        {/* Number */}
        <td className="font-semibold text-sm">{customer.phone}</td>
        {/* Quantity */}
        <td className="font-semibold text-sm">{customer.totalQuantity}</td>
        {/* Total amount */}
        <td className="font-semibold text-sm">{customer.totalAmount}</td>
        {/* Status */}
      <td>
      {(role === "ADMIN" || role === "MODERATOR") ? (
    <select
      defaultValue={customer.customerType}
      className="select select-bordered select-xs w-28 focus:outline-none"
      onChange={(e) => updateCustomerStatusMutation({ id: customer.id, customerType: e.target.value,})}>
      <option value="REGULAR">REGULAR</option>
      <option value="VIP">VIP</option>
      <option value="FRAUD_RISK">FRAUD_RISK</option>
    </select>) : (
    <span className="badge badge-ghost badge-sm font-semibold">{customer.customerType}</span>)}</td>
        {/* CreatedAt */}
        <td className="font-semibold text-sm">{new Date(customer.createdAt).toLocaleDateString()}</td>
        {/* Action Buttons */}
        <td><Link to={`${customer.id}`}> <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">View</button></Link>
        </td></tr>)))}
        </tbody>
        </table>
        </div>
    </div>
  );
};

export default CustomerTable;