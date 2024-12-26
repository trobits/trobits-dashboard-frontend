/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useCreateLuncBurnMutation,
  useCreateShibaBurnMutation,
  useDeleteLuncBurnMutation,
  useDeleteShibaBurnMutation,
  useGetAllArchiveQuery,
  useGetAllLuncBurnsQuery,
  useGetAllShibaBurnsQuery,
  useUpdateLuncBurnMutation,
  useUpdateShibaBurnMutation,
} from "@/redux/features/api/archiveApi";
import Loading from "@/components/shared/Loading";
import toast from "react-hot-toast";

interface LuncBurnRecord {
  id: string;
  currency: string;
  // ISO date string
  date: string;
  transactionRef: string;
  burnCount: number;
  // Optional field if not always present
  shibaBurnArchiveId?: string;
}

const LuncBurnsPage: React.FC = () => {
  const [records, setRecords] = useState<LuncBurnRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  //apis mutaions
  const [createLuncBurnMutation, { isLoading: createLuncBurnLoading }] =
    useCreateLuncBurnMutation();
  //all archives data
  const { data: allArchiveData, isLoading: allArchiveDataLoading } =
    useGetAllArchiveQuery("");
  //update
  const [updateLuncBurnMutation, { isLoading: updateLuncBurnLoading }] =
    useUpdateLuncBurnMutation();
  //delete
  const [deleteLuncBurnMutation, { isLoading: deleteLuncBurnLoading }] =
    useDeleteLuncBurnMutation();
  // Month Picker State
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const formatSelectedMonth = (date: Date) => {
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    return { month, year };
  };
  const { month, year } = formatSelectedMonth(selectedMonth);
  //get all shiba burns with month and year
  const { data: allLuncBurnsData, isLoading: allLuncBurnsDataLoading } =
    useGetAllLuncBurnsQuery(`?month=${month}&year=${year}`);

  const [newRecordData, setNewRecordData] = useState<any>({
    date: new Date(),
    burnCount: "",
    transactionRef: "",
  });

  const allArchive =
    allArchiveData?.data?.length > 0 ? allArchiveData?.data : [];

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddRecord = async () => {
    try {
      const newRecord = {
        date: newRecordData.date.toISOString().split("T")[0],
        transactionRef: newRecordData.transactionRef,
        burnCount: parseInt(newRecordData.burnCount, 10),
        id: allArchive?.[0]?.id,
      };
      const response = await createLuncBurnMutation(newRecord);
      if (response.error) {
        const errorMessage = (
          response as { error: { data: { message: string } } }
        ).error.data.message;
        toast.error(errorMessage);
        return;
      }
      setNewRecordData({
        date: new Date(),
        burnCount: "",
        transactionRef: "",
      });
      toast.success("Record added successfully!");
      setAddDialogOpen(false);
    } catch (error) {
      toast.error("error while adding record!");
    }
  };

  const handleEditClick = (record: LuncBurnRecord) => {
    setEditData({ ...record, date: new Date(record.date) });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (editData) {
        const updatedRecord = {
          ...editData,
          date: editData.date.toISOString().split("T")[0],
          id: editData?.id,
        };
        console.log(editData);
        const response = await updateLuncBurnMutation(updatedRecord);
        if (response.error) {
          const errorMessage = (
            response as { error: { data: { message: string } } }
          ).error.data.message;
          toast.error(errorMessage);
          return;
        }
        toast.success("Record updated successfully!");
      }
      setEditData(null);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleDeleteClick = (record: LuncBurnRecord) => {
    setSelectedRecord(record);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRecord) {
      const response = await deleteLuncBurnMutation(selectedRecord.id);
      if (response.error) {
        const errorMessage = (
          response as { error: { data: { message: string } } }
        ).error.data.message;
        toast.error(errorMessage);
        return;
      }
      toast.success("Record deleted successfully!");
      setDeleteConfirmationOpen(false);
      setSelectedRecord(null);
    }
  };

  // Populate records after fetching data
  useEffect(() => {
    if (allLuncBurnsData?.data?.length > 0) {
      setRecords(allLuncBurnsData.data);
    }
  }, [allLuncBurnsData]);

  if (allLuncBurnsDataLoading) {
    return <Loading />;
  }

  if (allLuncBurnsDataLoading) {
    return <Loading />;
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* month picker */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <MonthPicker
          selectedMonth={selectedMonth}
          onChange={(newValue: Date | null) => {
            if (newValue) {
              setSelectedMonth(newValue);
            }
          }}
        />
        <Typography variant="h6" className="font-bold text-gray-800">
          Selected Month: {`month:${month}, year:${year}`}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" className="font-bold text-gray-800">
          Lunc Burns Archive
        </Typography>
        <Chip
          label={`Total Records: ${allLuncBurnsData?.data?.length}`}
          color="primary"
        />
        <Button variant="contained" onClick={handleAddClick}>
          Add New Record
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    className=" font-bold"
                    style={{ fontWeight: "bold" }}
                  >
                    Date
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Burn Count
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Transaction Ref
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allLuncBurnsData?.data?.length > 0 ? (
                  sortedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {/* edit mode */}
                        {isEditing && editData?.id === record.id
                          ? // <LocalizationProvider dateAdapter={AdapterDateFns}>
                            //   <DatePicker
                            //     value={editData.date}
                            //     onChange={(newValue) =>
                            //       setEditData((prev: any) => ({
                            //         ...prev,
                            //         date: newValue,
                            //       }))
                            //     }
                            //     slots={{ textField: TextField }}
                            //     slotProps={{
                            //       textField: { fullWidth: true, margin: "normal" },
                            //     }}
                            //   />
                            // </LocalizationProvider>
                            format(parseISO(record.date), "MMMM dd, yyyy")
                          : format(parseISO(record.date), "MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {isEditing && editData?.id === record.id ? (
                          <TextField
                            type="number"
                            value={editData.burnCount}
                            onChange={(e) =>
                              setEditData((prev: any) => ({
                                ...prev,
                                burnCount: parseInt(e.target.value, 10),
                              }))
                            }
                          />
                        ) : (
                          record.burnCount.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing && editData?.id === record.id ? (
                          <TextField
                            value={editData.transactionRef}
                            onChange={(e) =>
                              setEditData((prev: any) => ({
                                ...prev,
                                transactionRef: e.target.value,
                              }))
                            }
                          />
                        ) : record?.transactionRef?.length > 20 ? (
                          record?.transactionRef?.slice(0, 20) + "..."
                        ) : (
                          record.transactionRef
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing && editData?.id === record.id ? (
                          <>
                            <Button
                              disabled={
                                createLuncBurnLoading ||
                                deleteLuncBurnLoading ||
                                updateLuncBurnLoading
                              }
                              className="mr-4"
                              style={{
                                backgroundColor: "#4CAF50",
                                color: "#fff",
                                fontWeight: "bold",
                                marginRight: "8px",
                              }}
                              onClick={handleSaveEdit}
                            >
                              Save
                            </Button>
                            <Button
                              disabled={
                                createLuncBurnLoading ||
                                deleteLuncBurnLoading ||
                                updateLuncBurnLoading
                              }
                              variant="outlined"
                              color="secondary"
                              style={{
                                color: "#f44336",
                                borderColor: "#f44336",
                                fontWeight: "bold",
                              }}
                              onClick={() => {
                                setIsEditing(false);
                                setEditData(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              disabled={
                                createLuncBurnLoading ||
                                deleteLuncBurnLoading ||
                                updateLuncBurnLoading
                              }
                              className="mr-4"
                              style={{
                                backgroundColor: "#FFC107",
                                color: "#fff",
                                fontWeight: "bold",
                                marginRight: "8px",
                              }}
                              onClick={() => handleEditClick(record)}
                            >
                              Edit
                            </Button>
                            <Button
                              disabled={
                                createLuncBurnLoading ||
                                deleteLuncBurnLoading ||
                                updateLuncBurnLoading
                              }
                              style={{
                                backgroundColor: "#f44336",
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                              onClick={() => handleDeleteClick(record)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div className=" ">
                    <h1 className="text-center text-2xl py-5  font-bold text-gray-800">
                      No Records Found
                    </h1>
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={newRecordData.date}
              onChange={(newValue) =>
                setNewRecordData((prev: any) => ({ ...prev, date: newValue }))
              }
              slots={{ textField: TextField }}
              slotProps={{
                textField: { fullWidth: true, margin: "normal" },
              }}
            />
          </LocalizationProvider>
          <TextField
            type="number"
            label="Burn Count"
            value={newRecordData.burnCount}
            onChange={(e) =>
              setNewRecordData((prev: any) => ({
                ...prev,
                burnCount: e.target.value,
              }))
            }
          />
          <TextField
            label="Transaction Reference"
            value={newRecordData.transactionRef}
            onChange={(e) =>
              setNewRecordData((prev: any) => ({
                ...prev,
                transactionRef: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            disabled={
              createLuncBurnLoading ||
              deleteLuncBurnLoading ||
              updateLuncBurnLoading
            }
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={handleAddRecord}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Shiba Burns record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              createLuncBurnLoading ||
              deleteLuncBurnLoading ||
              updateLuncBurnLoading
            }
            style={{
              backgroundColor: "#f44336",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

//month picker
const MonthPicker = ({ selectedMonth, onChange }: any) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year", "month"]}
        value={selectedMonth}
        onChange={onChange}
        openTo="month" // This ensures the picker opens to the month view by default
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            variant: "outlined",
            label: "Select Month",
            fullWidth: false,
            margin: "normal",
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default LuncBurnsPage;
