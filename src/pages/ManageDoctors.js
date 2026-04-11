import React, { useState, useEffect } from 'react';
import StaffDirectory from '../components/StaffDirectory';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';

const ManageDoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await adminService.getDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return (
        <DashboardLayout title="Manage Doctors" subtitle="Loading staff...">
            <p style={{ textAlign: 'center', padding: '50px' }}>Loading doctors...</p>
        </DashboardLayout>
    );

    return (
        <StaffDirectory 
            title="Manage Doctors" 
            searchPlaceholder="Search by name or department..." 
            initialData={doctors}
        />
    );
};

export default ManageDoctorsPage;
