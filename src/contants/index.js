import moment from "moment"; // Make sure to install moment: npm install moment
import axios from "axios"; // Import axios
import { APIServices } from "../hooks/fetchAPI";

const API_BASE_URL = "https://611systems.com/api/messenger/?";

export const login = async (email, password) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        ac: "611",
        dc: "1",
        ak: "546453435asd23asd143asdk23kj4h5y4gh23",
        act: "login",
        email: email,
        pass: password,
      },
      headers: {
        "User-Agent": "react-app",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return ""; // Handle null or undefined input
  }
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return "";
  }

  return date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");

  //   if (inputDate.isSame(today, 'day')) {
  //     return "Today";
  //   } else if (inputDate.isSame(yesterday, 'day')) {
  //     return "Yesterday";
  //   } else {
  //     return date.format("YYYY-MM-DD");
  //   }
};

export const testGroupList = [
  {
    group_name: "Test Group 1",
    latest_message: "Test User 1 : Message Content",
    letter: "1",
  },
  {
    group_name: "Test Group 2",
    latest_message: "Test User 2 : Message Content",
    letter: "2",
  },
  {
    group_name: "Test Group 3",
    latest_message: "Test User 3 : Message Content",
    letter: "3",
  },
  {
    group_name: "Test Group 4",
    latest_message: "Test User 4 : Message Content",
    letter: "4",
  },
  {
    group_name: "Test Group 5",
    latest_message: "Test User 5 : Message Content",
    letter: "5",
  },
  {
    group_name: "Test Group 6",
    latest_message: "Test User 6 : Message Content",
    letter: "6",
  },
  {
    group_name: "Test Group 7",
    latest_message: "Test User 7 : Message Content",
    letter: "7",
  },
  {
    group_name: "Test Group 8",
    latest_message: "Test User 8 : Message Content",
    letter: "8",
  },
  {
    group_name: "Test Group 9",
    latest_message: "Test User 9 : Message Content",
    letter: "9",
  },
  {
    group_name: "Test Group 10",
    latest_message: "Test User 10 : Message Content",
    letter: "10",
  },
  {
    group_name: "Test Group 11",
    latest_message: "Test User 11 : Message Content",
    letter: "11",
  },
  {
    group_name: "Test Group 12",
    latest_message: "Test User 12 : Message Content",
    letter: "12",
  },
  {
    group_name: "Test Group 13",
    latest_message: "Test User 13 : Message Content",
    letter: "13",
  },
  {
    group_name: "Test Group 14",
    latest_message: "Test User 14 : Message Content",
    letter: "14",
  },
  {
    group_name: "Test Group 15",
    latest_message: "Test User 15 : Message Content",
    letter: "15",
  },
  {
    group_name: "Test Group 16",
    latest_message: "Test User 16 : Message Content",
    letter: "16",
  },
  {
    group_name: "Test Group 17",
    latest_message: "Test User 17 : Message Content",
    letter: "17",
  },
  {
    group_name: "Test Group 18",
    latest_message: "Test User 18 : Message Content",
    letter: "18",
  },
];

export const testUser = [
  { id: 1, name: "John" },
  { id: 2, name: "Smith" },
  { id: 3, name: "Alex" },
  { id: 4, name: "Mark" },
  { id: 5, name: "Daniel" },
  { id: 6, name: "Tether" },
  { id: 7, name: "Binance" },
  { id: 8, name: "Cardano" },
  { id: 9, name: "ChainLink" },
  { id: 10, name: "Tron" },
  { id: 11, name: "Avalanche" },
  { id: 12, name: "Stellar" },
  { id: 13, name: "Hedera" },
  { id: 14, name: "Shyrah Lila Key" },
];

export function getNameById(id) {
  const user = testUser.find((user) => user.id === parseInt(id));
  return user ? user.name : undefined;
}

export const getName = async (id) => {
  const response = await APIServices.post({
    url: `/get-users-detail`,
    payload: { user_id: id },
  });

  return response?.data?.["first name"] || undefined;
};

export const getFullName = async (id) => {
  const response = await APIServices.post({
    url: `/get-users-detail`,
    payload: { user_id: id },
  });

  return (
    `${response?.data?.["first name"]} ${response?.data?.["last name"]}` ||
    undefined
  );
};

export function formatDisplayDate(dateString) {
  if (!dateString) return ""; // Handle null or undefined

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Check for invalid date
      console.error("Invalid date format:", dateString);
      return "";
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Remove time for accurate day comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      // Today: Show time only
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (date.getTime() === yesterday.getTime()) {
      // Yesterday: "Yesterday HH:MM a"
      return `Yesterday ${new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if ((today - date) / (1000 * 60 * 60 * 24) < 7) {
      // Last 7 days: Show weekday name
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      // Otherwise: Show "DD Mon"
      return date.toLocaleDateString([], { day: "2-digit", month: "short" });
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white", // Background color of the control
    border: "1px solid #ced4da", // Border color
    borderRadius: "4px",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(0,123,255,.25)" : null, // Blue outline on focus
    "&:hover": {
      borderColor: "#80bdff", // Border color on hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#007bff" : "white", // Blue background on hover/focus
    color: state.isFocused ? "white" : "black", // White text on hover/focus
    cursor: "pointer",
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "#f3f4f6", // Background color of selected values
    color: "white",
    borderRadius: "4px",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: "black",
    ":hover": {
      backgroundColor: "#16a34a", // Darker blue on remove hover
      color: "white",
      cursor: "pointer",
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#ced4da", // Color of the dropdown arrow
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Remove the separator line
  }),
};

export const renameFile = (file) => {
  const newFileName = `${Date.now()}_${file.name}`;
  const renamedFile = new File([file], newFileName, { type: file.type });
  return renamedFile;
};

export const convertToBase64 = (file, setFileBase64) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    setFileBase64(base64String);
  };

  reader.readAsDataURL(file);
};

export const validateFileType = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  return allowedTypes.includes(file.type);
};

export const isPDF = (file) => {
  const extension = file?.split(".").pop().toLowerCase();
  if (["pdf"].includes(extension)) {
    return true;
  }

  return false;
};

export const convertFileDataArray = (fileDataArray) => {
  if (!Array.isArray(fileDataArray)) {
    return []; // Return empty array for invalid input
  }

  return fileDataArray.map((fileData) => {
    let name = fileData.file_name;

    if (fileData.file_path) {
      const pathParts = fileData.file_path.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart) {
        name = lastPart;
      }
    }

    if (name === "blob") {
      name = "back.jpg";
    }

    let lastModified = null;
    if (fileData.created_at) {
      const date = new Date(fileData.created_at);
      lastModified = date.getTime();
    } else {
      lastModified = Date.now();
    }

    const blob = new Blob([""], {
      type: fileData.file_type || "application/octet-stream",
    });

    return {
      name: name,
      id: fileData.id,
      lastModified: lastModified,
      type: fileData.file_type,
      blob: blob,
    };
  });
};

// export const convertFileDataArray = (fileDataArray) => {
//   if (!Array.isArray(fileDataArray)) return [];

//   return fileDataArray
//     .map((fileData) => {
//       if (!fileData || typeof fileData !== "object") return null;

//       // Extract filename
//       let name = fileData.file_name || "unknown_file";
//       if (fileData.file_path) {
//         const lastPart = fileData.file_path.split("/").pop();
//         name = lastPart || name;
//       }
//       if (name === "blob") name = "back.jpg";

//       // Extract last modified time
//       const lastModified = fileData.created_at
//         ? new Date(fileData.created_at).getTime()
//         : Date.now();

//       // Get file content (convert to Uint8Array if it's base64)
//       let fileContent = "";
//       if (fileData.file_content) {
//         try {
//           fileContent = atob(fileData.file_content); // Decode base64 (if applicable)
//         } catch (error) {
//           fileContent = fileData.file_content; // Use as is if not base64
//         }
//       }

//       // Create a Blob with the correct type and content
//       const blobType = fileData.file_type || "application/octet-stream";
//       const blob = new Blob([fileContent], { type: blobType });

//       return {
//         name,
//         lastModified,
//         size: 350000, // Ensure size is included
//         type: blobType,
//         blob,
//       };
//     })
//     .filter(Boolean); // Remove any null values
// };


export const p2pFilter = (data, user) => {

  return parseInt(data?.created_by) === parseInt(user?.id) ?
    `${data?.message_group_assign?.[0]?.user?.fname} ${data?.message_group_assign?.[0]?.user?.lname}` :
    `${data?.group_owner?.fname} ${data?.group_owner?.lname}`;

}

export const p2pFilterIcon = (data, user) => {

  return parseInt(data?.created_by) === parseInt(user?.id) ?
    `${data?.message_group_assign?.[0]?.user?.fname?.charAt(0).toUpperCase()}` :
    `${data?.group_owner?.fname?.charAt(0).toUpperCase()}`;

}


export const showNotification = (pusherEvent) => {
  if ('Notification' in window && Notification.permission === 'granted') {

    const notification = new Notification(`${pusherEvent?.message?.message_group?.group_name}`, {
      body: `${pusherEvent?.message?.user?.fname} ${pusherEvent?.message?.user?.lname} : ${pusherEvent?.message?.text_message}`,
      icon: '../../../public/favicon.ico',
    });

    // const sound = new Audio('sounds/notification_sound.mp3');

    notification.onclick = () => {
      // sound.play();
      window.open(`${window.location.origin}/public/611Fe/message/${pusherEvent?.group_id}`);
      notification.close();
    };

  } else if ('Notification' in window && Notification.permission !== 'denied') {

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification(`${pusherEvent?.message?.message_group?.group_name}`, {
          body: `${pusherEvent?.message?.user?.fname} ${pusherEvent?.message?.user?.lname} : ${pusherEvent?.message?.text_message}`,
          icon: '/favicon.ico',
        });

        // const sound = new Audio('sounds/notification_sound.mp3');
        // sound.play();

        notification.onclick = () => {

          window.open(`${window.location.origin}/public/611Fe/message/${pusherEvent?.group_id}`, '_blank');
          notification.close();
        };
      }
    });
  } else {
    console.log('Notification permission not granted.');

  }
};