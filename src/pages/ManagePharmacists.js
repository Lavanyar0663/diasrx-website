import React, { useState, useEffect } from 'react';
import StaffDirectory from '../components/StaffDirectory';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';

const ManagePharmacistsPage = () => {
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPharmacists = async () => {
            try {
                const data = await adminService.getPharmacists();
                setPharmacists(data);
            } catch (error) {
                console.error("Error fetching pharmacists", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPharmacists();
    }, []);

    if (loading) return (
        <DashboardLayout title="Manage Pharmacists" subtitle="Loading staff...">
            <p style={{ textAlign: 'center', padding: '50px' }}>Loading pharmacists...</p>
        </DashboardLayout>
    );

    return (
        <StaffDirectory 
            title="Manage Pharmacists" 
            searchPlaceholder="Search pharmacists by name..." 
            initialData={pharmacists}
            hideDepartment={true}
        />
    );
};

export default ManagePharmacistsPage;
