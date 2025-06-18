// src/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }
  return response.json();
};

// EMPLOYEE/USER ENDPOINTS
export const getEmployees = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getEmployee = async (id, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const createEmployee = async (data, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateEmployee = async (id, data, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteEmployee = async (id, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getUserById = getEmployee;
export const getUsers = getEmployees;
export const createUser = createEmployee;

// JOB APPLICATIONS
export const getJobApplications = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getUserJobRequests = getJobApplications;

export const createJobApplication = async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/job-applications/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  };

export const updateJobApplication = async (id, data, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/job-applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const moveJobApplicationToHold = async (id, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/job-applications/${id}/hold`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// REQUESTS
export const getRequests = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const createRequest = async (data, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateRequestStatus = async (id, status, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};

// TIMESHEET
export const getTimerollData = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/timesheets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getTimeroll = async (id, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/timesheets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// PAYROLL
export const getPayrollData = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/payroll`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const getPayroll = async (id, getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/payroll/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// DASHBOARD
export const getDashboardStats = async (getToken) => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const checkIn = async (user_id, getToken) => {
  const token = await getToken();
  const rawId = user_id?.split("|")[1]; // ✅ Strip "auth0|" prefix
  const res = await fetch(`${API_BASE_URL}/api/timesheets/check-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: rawId }),
  });
  return handleResponse(res);
};

export const checkOut = async (user_id, getToken) => {
  const token = await getToken();
  const rawId = user_id?.split("|")[1]; // ✅ Strip "auth0|" prefix
  const res = await fetch(`${API_BASE_URL}/api/timesheets/check-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: rawId }),
  });
  return handleResponse(res);
};

