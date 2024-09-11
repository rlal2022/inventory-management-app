"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { SignInButton, useUser } from "@clerk/nextjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [quantity, setQuanity] = useState(1);
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const addItem = async () => {
    const userId = user.id;

    const userRef = doc(
      db,
      `users/${userId}/inventory/categories/${category}/${itemName}`
    );

    try {
      await setDoc(userRef, {
        name: itemName,
        quantity: quantity + 1,
      });
    } catch (error) {
      console.error("Error adding to inventory: ", error);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(doc(db, `inventory/category/${category}/${item}`));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!user) {
    return (
      <>
        <Typography>You must be signed in to view this page</Typography>
        <SignInButton />
      </>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Typography>Pantry app</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                id="category"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  " .MuiSelect-root, .MuiSelect-select": {
                    color: "#000",
                  },
                }}
              >
                <MenuItem value="Produce">Produce</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
                <MenuItem value="Meats & Seafoods">Meats & Seafoods</MenuItem>
                <MenuItem value="Seafood">Seafood</MenuItem>
                <MenuItem value="Dry Goods & Grains">
                  Dry Goods & Grains
                </MenuItem>
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Condiments & Sauces">
                  Condiments & Sauces
                </MenuItem>
                <MenuItem value="Spices & Seasonings">
                  Spices & Seasonings
                </MenuItem>
                <MenuItem value="Frozen Items">Frozen Items</MenuItem>
                <MenuItem value="Breads & Baked Goods">
                  Breads & Baked Goods
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                addItem();
                setItemName("");
                setCategory("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
