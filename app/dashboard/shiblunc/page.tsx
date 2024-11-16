/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useGetLuncInformationQuery, useGetShibaInformationQuery, useUpdateLuncMutation, useUpdateShibaMutation } from "@/redux/features/api/currencyApi";
import { useState, useEffect } from "react";

export interface Shiba {
  id: string;
  visits: string;
  revenue: string;
  burns: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lunc {
  id: string;
  visits: string;
  revenue: string;
  burns: string;
  createdAt: Date;
  updatedAt: Date;
}

const CryptoTable = () => {
  const { data: shibaInformation, isLoading: shibaDataLoading } = useGetShibaInformationQuery("");
  const { data: luncInformation, isLoading: luncDataLoading } = useGetLuncInformationQuery("");

  const [ shibData, setShibData ] = useState<Shiba | null>(null);
  const [ luncData, setLuncData ] = useState<Lunc | null>(null);
  const [ isEditing, setIsEditing ] = useState<boolean>(false); // State to toggle edit mode

  const [ updateShiba, { isLoading: updateShibaLoading } ] = useUpdateShibaMutation();
  const [ updateLuna, { isLoading: updateLunaLoading } ] = useUpdateLuncMutation();

  // Fetch and set the data when the data is loaded
  useEffect(() => {
    if (shibaInformation) {
      setShibData(shibaInformation?.data);
    }
    if (luncInformation) {
      setLuncData(luncInformation?.data);
    }
  }, [ shibaInformation, luncInformation ]);

  const handleChange = (
    cryptoType: "SHIB" | "LUNC",
    field: keyof Shiba | keyof Lunc,
    value: string
  ) => {
    if (cryptoType === "SHIB" && shibData) {
      setShibData({
        ...shibData,
        [ field ]: value,
      });
    } else if (cryptoType === "LUNC" && luncData) {
      setLuncData({
        ...luncData,
        [ field ]: value,
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleSave = () => {
    if (shibData) {
      updateShiba({ ...shibData, id: shibData.id });
    }
    if (luncData) {
      updateLuna({ ...luncData, id: luncData.id });
    }
    setIsEditing(false); // Exit edit mode after saving
  };

  const renderTable = (
    cryptoData: Shiba | Lunc | null,
    cryptoType: "SHIB" | "LUNC"
  ) => {
    if (!cryptoData) return null;

    return (
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {cryptoType === "SHIB" ? "Shiba Inu" : "Luna Classic"} ({cryptoType})
        </h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Metric</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {[ "visits", "revenue", "burns" ].map((field) => (
              <tr key={field} className="border-b border-gray-200">
                <td className="px-4 py-2 capitalize text-gray-600">{field}</td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={cryptoData[ field as keyof Shiba | keyof Lunc ] || ""}
                      onChange={(e) =>
                        handleChange(cryptoType, field as keyof Shiba | keyof Lunc, e.target.value)
                      }
                      className="flex-grow bg-gray-50 text-gray-700 px-2 py-1 rounded border focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <span className="text-gray-700">{cryptoData[ field as keyof Shiba | keyof Lunc ]}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
      }}
    >
      <h2 className="text-3xl font-bold text-black mb-8 drop-shadow-lg">
        Crypto Management Dashboard
      </h2>
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        {renderTable(shibData, "SHIB")}
        {renderTable(luncData, "LUNC")}
      </div>
    </div>
  );
};

export default CryptoTable;
