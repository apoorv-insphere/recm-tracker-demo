"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import router from "next/router";
import { useEffect } from "react";
import { useIndexedDB, RecommendationRecord } from "@/src/hooks/useIndexedDB";
import { APP_URL } from "@/src/config/constants";
import { populateDemoData } from "@/src/utlis/demoData";


interface DraftRecommendation {
    id: string;
    sn: string;
    equipmentId: string;
    recommendationDescription: string;
    date: string;
    unit: string;
    department: string;
    section: string;
}

interface Recommendation {
    id: string;
    sn: string;
    date: string;
    recommendationNo: string;
    equipmentId: string;
    recommendationDescription: string;
    initialRiskScore: string;
    finalRiskScore: string;
    estimatedCost: number;
    roi: string;
    status: string;
    source: string;
    location: string;
}

interface ChangeHistory {
    id: string;
    recommendationId: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    changedBy: string;
    changedAt: string;
    changeType: "creation" | "update" | "status_change" | "approval";
    remarks?: string;
}

const RecommendationTracker = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
    const totalRecords = 45;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const {
        getAllRecommendations,
        deleteRecommendation,
        saveRecommendation,
        isReady
    } = useIndexedDB();

    const [recommendations, setRecommendations] = useState<RecommendationRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isReady) {
            loadRecommendations();
        }
    }, [isReady]);

    const DEMO_SEEDED_KEY = 'recmd_demo_seeded';

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            const alreadySeeded = localStorage.getItem(DEMO_SEEDED_KEY);

            if (!alreadySeeded) {
                await populateDemoData(saveRecommendation);
                localStorage.setItem(DEMO_SEEDED_KEY, 'true');
            }

            const data = await getAllRecommendations();
            setRecommendations(data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this recommendation?')) {
            await deleteRecommendation(id);
            await loadRecommendations();
        }
    };

    const handleRefresh = () => {
  // Remove the demo seeded flag from localStorage
  localStorage.removeItem('recmd_demo_seeded');
  // Reload the page to trigger demo data re-seeding
  window.location.reload();
};

    // Mock data for drafts
    const draftRecommendations: DraftRecommendation[] = [
        {
            id: "1",
            sn: "1",
            equipmentId: "EQ-1001",
            recommendationDescription: "Conveyor Belt System",
            date: "2026-03-20",
            unit: "Angul (LOG)",
            department: "Maintenance",
            section: "Mechanical",
        },
        {
            id: "2",
            sn: "2",
            equipmentId: "EQ-1002",
            recommendationDescription: "Jaw Crusher",
            date: "2026-03-19",
            unit: "Angul (LOG)",
            department: "Operations",
            section: "Crushing",
        },
    ];

    // Mock data for published recommendations


    // Mock change history data
    const getChangeHistory = (recommendationId: string): ChangeHistory[] => {
        const histories: { [key: string]: ChangeHistory[] } = {
            "1": [
                {
                    id: "h1",
                    recommendationId: "1",
                    fieldName: "Recommendation",
                    oldValue: "",
                    newValue: "Initial recommendation created",
                    changedBy: "John Doe",
                    changedAt: "2026-03-15 09:30:00",
                    changeType: "creation",
                    remarks: "Initial submission",
                },
                {
                    id: "h2",
                    recommendationId: "1",
                    fieldName: "Status",
                    oldValue: "Open",
                    newValue: "In-Progress",
                    changedBy: "Sarah Johnson",
                    changedAt: "2026-03-16 14:20:00",
                    changeType: "status_change",
                    remarks: "Assigned to maintenance team",
                },
                {
                    id: "h3",
                    recommendationId: "1",
                    fieldName: "Estimated Cost",
                    oldValue: "₹200,000",
                    newValue: "₹250,000",
                    changedBy: "Mike Wilson",
                    changedAt: "2026-03-18 11:45:00",
                    changeType: "update",
                    remarks: "Updated after detailed analysis",
                },
                {
                    id: "h4",
                    recommendationId: "1",
                    fieldName: "Risk Score",
                    oldValue: "12",
                    newValue: "8",
                    changedBy: "Dr. Emily Brown",
                    changedAt: "2026-03-20 16:15:00",
                    changeType: "update",
                    remarks: "Re-evaluated with new safety measures",
                },
                {
                    id: "h5",
                    recommendationId: "1",
                    fieldName: "Status",
                    oldValue: "In-Progress",
                    newValue: "Implemented",
                    changedBy: "Robert Chen",
                    changedAt: "2026-03-22 10:00:00",
                    changeType: "status_change",
                    remarks: "Implementation completed successfully",
                },
            ],
            "2": [
                {
                    id: "h1",
                    recommendationId: "2",
                    fieldName: "Recommendation",
                    oldValue: "",
                    newValue: "Initial recommendation created",
                    changedBy: "Alice Smith",
                    changedAt: "2026-03-14 10:15:00",
                    changeType: "creation",
                    remarks: "Submitted by safety team",
                },
                {
                    id: "h2",
                    recommendationId: "2",
                    fieldName: "Status",
                    oldValue: "Open",
                    newValue: "In-Progress",
                    changedBy: "David Lee",
                    changedAt: "2026-03-15 09:00:00",
                    changeType: "status_change",
                    remarks: "Assigned to operations team",
                },
                {
                    id: "h3",
                    recommendationId: "2",
                    fieldName: "Description",
                    oldValue: "Update SOP for TMT end capping",
                    newValue: "The SOP for TMT end capping job shall be updated and implemented with prior training to helpers, trailer drivers and supervisors",
                    changedBy: "Alice Smith",
                    changedAt: "2026-03-16 13:30:00",
                    changeType: "update",
                    remarks: "Added detailed description",
                },
            ],
            "3": [
                {
                    id: "h1",
                    recommendationId: "3",
                    fieldName: "Recommendation",
                    oldValue: "",
                    newValue: "Initial recommendation created",
                    changedBy: "James Wilson",
                    changedAt: "2026-03-13 08:45:00",
                    changeType: "creation",
                    remarks: "Identified during safety audit",
                },
                {
                    id: "h2",
                    recommendationId: "3",
                    fieldName: "Location",
                    oldValue: "Loading Area",
                    newValue: "Angul (LOG)",
                    changedBy: "James Wilson",
                    changedAt: "2026-03-13 11:20:00",
                    changeType: "update",
                    remarks: "Corrected location",
                },
            ],
        };
        return histories[recommendationId] || [];
    };

    // Status options for filter
    const statusOptions = [
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "implemented", label: "Implemented" },
        { value: "closed", label: "Closed" },
        { value: "rejected", label: "Rejected" },
    ];

    // Unit options for filter
    const unitOptions = [
        { value: "crushing", label: "Crushing Unit" },
        { value: "screening", label: "Screening Unit" },
        { value: "stockyard", label: "Stockyard" },
    ];

    // Department options for filter
    const departmentOptions = [
        { value: "maintenance", label: "Maintenance" },
        { value: "operations", label: "Operations" },
        { value: "environment", label: "Environment" },
        { value: "electrical", label: "Electrical" },
    ];

    // Get risk level color
    const getRiskLevelColor = (score: string) => {
        const numScore = parseInt(score);
        if (numScore <= 5) return "text-success";
        if (numScore <= 12) return "text-warning";
        if (numScore <= 20) return "text-danger";
        return "text-dark";
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-primary";
            case "in-progress":
                return "bg-info";
            case "implemented":
                return "bg-success";
            case "closed":
                return "bg-secondary";
            case "rejected":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    // Get change type icon
    const getChangeTypeIcon = (type: string) => {
        switch (type) {

            case "update":
                return "✏️"
        }
    };

    // Get change type badge color
    const getChangeTypeColor = (type: string) => {
        switch (type) {
            case "creation":
                return "bg-success";
            case "update":
                return "bg-info";
            case "status_change":
                return "bg-warning";
            case "approval":
                return "bg-primary";
            default:
                return "bg-secondary";
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecommendations = recommendations.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedUnit("");
        setSelectedDepartment("");
        setFromDate("");
        setToDate("");
        setSelectedStatus("");
        setIsFilterOpen(false);
    };

    const handleViewHistory = (recommendation: Recommendation) => {
        setSelectedRecommendation(recommendation);
        setIsHistoryModalOpen(true);
    };

    const handleCreateRecommendation = () => {
        router.push(APP_URL.CREATE_RECMD);
    };

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <div className="admin-boxContainer d3">
                    <div className="adminAction">
                        <Link href="./" className="adminAction__title">
                            <span className="icon">
                                <img
                                    width="15"
                                    height="15"
                                    alt="icon"
                                    src="/images/svg/arrow-left-grey.svg"
                                    className="img-fluid u-image"
                                />
                            </span>
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* 
        {draftRecommendations.length > 0 && (
          <div className="d2">
            <div className="pb-4">
              <div className="admin-boxContainer d1">
                <div
                  className="adminAction mb-3"
                  style={{ backgroundColor: "#446181", height: "40px" }}
                >
                  <div className="text-white ps-2 font-weight-bold py-2">
                    Draft Recommendations: {draftRecommendations.length}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="admin-table d3 table-responsive noHover">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "90px" }}>S no</th>
                            <th>Object Id</th>
                            <th>Recmd Description</th>
                            <th>Recommendation</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {draftRecommendations.map((item) => (
                            <tr key={item.id}>
                              <td>{item.sn}</td>
                              <td>{item.equipmentId}</td>
                              <td>{item.recommendationDescription}</td>
                              <td>{item.recommendationDescription.substring(0, 50)}...</td>
                              <td>{new Date(item.date).toLocaleDateString()}</td>
                              <td>
                                {item.unit}
                                <br />
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                  }}
                                >
                                  <button className="tableBtn" type="button">
                                    <span className="u-icon">
                                      <Image
                                        width={15}
                                        height={15}
                                        src="/images/svg/edit-icon-blue.svg"
                                        alt="edit"
                                      />
                                    </span>
                                  </button>
                                  <button className="tableBtn" type="button">
                                    <span className="u-icon">
                                      <Image
                                        width={15}
                                        height={15}
                                        alt="icon"
                                        src="/images/svg/delete-icon.svg"
                                        className="img-fluid u-image"
                                        onClick={() => handleDelete(item.id)}

                                      />
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} Draft Recommendations Section */}

                {/* Main Recommendations Table */}
                <div className="admin-boxContainer d2">
                    <div className="adminFilters d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            <button
                                className="adminFilters__btn"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <img
                                    width="15"
                                    height="15"
                                    alt="Filter"
                                    src="/images/svg/filter-icon.svg"
                                    className="img-fluid u-image"
                                />
                            </button>
                           <button
  type="button"
  className="iconBtn orange"
  onClick={handleRefresh}  // Changed from resetFilters to handleRefresh
>
  Refresh
  <img
    width="25"
    height="25"
    alt="Refresh"
    src="/images/svg/refresh-icon.svg"
    className="img-fluid u-image"
  />
</button>
                        </div>
                        <div>
                            <Link href={APP_URL.CREATE_RECMD}>

                                <button className="iconBtn green">
                                    <span>Create Recommendation</span>
                                    <img
                                        width="15"
                                        height="15"
                                        alt="Edit"
                                        src="/images/svg/edit-icon.svg"
                                        className="img-fluid u-image"
                                    />
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>

                <div className="admin-boxContainer d1">
                    <div className="row">
                        <div className="col-12">
                            <div className="admin-table d3 table-responsive noHover">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: "90px" }}>S no</th>
                                            <th style={{ minWidth: "90px" }}>Date</th>
                                            <th style={{ minWidth: "120px" }}>Recommendation ID.</th>
                                            <th style={{ minWidth: "200px" }}>Description</th>
                                            <th style={{ minWidth: "120px" }}>Source</th>
                                            <th style={{ minWidth: "120px" }}>Location/SP</th>
                                            <th style={{ minWidth: "100px" }}>Risk Score (Initial/Final)</th>
                                            <th style={{ minWidth: "100px" }}>Est. Cost (in Cr)</th>
                                            <th style={{ minWidth: "120px" }}>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRecommendations.length > 0 ? (
                                            paginatedRecommendations.map((item, index) => (
                                                <tr key={item.id}><td>{index + 1}</td>
                                                    <td>
                                                        {item.dateOfRecommendation instanceof Date
                                                            ? item.dateOfRecommendation.toLocaleDateString()
                                                            : new Date(item.dateOfRecommendation).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#005A8C", fontWeight: 600 }}>
                                                            {item.recommendationNo}
                                                        </span>
                                                    </td>
                                                    <td >{item.recommendationDescription}</td>
                                                    <td>{item.source}</td>
                                                    <td>{item.location}/{item.plantName}</td>
                                                    <td>
                                                        <span>
                                                            {item.finalRiskScore}/{item.finalRiskScore}
                                                        </span>
                                                    </td>
                                                    <td>{item.estimatedCost.toLocaleString()}</td>
                                                    <td>
                                                        {item.status}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                            <Link href={`/recmd-tracker/update-recommendation?id=${item.id}`}>
                                                                <button className="tableBtn" type="button" title="Edit Recommendation">
                                                                    <span>
                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            alt="edit"
                                                                            src="/images/svg/edit-icon-blue.svg"
                                                                            className="img-fluid u-image"
                                                                        />
                                                                    </span>
                                                                </button>
                                                            </Link>

                                                            <button className="tableBtn" type="button" onClick={() => handleDelete(item.id)}>
                                                                <span>
                                                                    <img
                                                                        width="15"
                                                                        height="15"
                                                                        alt="edit"
                                                                        src="/images/svg/delete-icon.svg"
                                                                        className="img-fluid u-image"
                                                                    />
                                                                </span>
                                                            </button>

                                                            {/* History button */}

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={10} className="text-center">
                                                    No recommendations found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalRecords > 0 && (
                                <div className="pagination_container">
                                    <div className="recordsWrapper">
                                        <select
                                            name="pageSize"
                                            id="pageSize"
                                            className="recordsWrapper__list"
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                        >
                                            {PAGE_SIZE_OPTIONS.map((size) => (
                                                <option key={size} value={size} className="recordsWrapper__item">
                                                    {size} Records
                                                </option>
                                            ))}
                                        </select>
                                        <span className="recordsWrapper__value">
                                            {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords}{" "}
                                            records
                                        </span>
                                    </div>
                                    <nav className="pagination_wrapper">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <button
                                                    className="page-link actionBtns"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    <img
                                                        width="15"
                                                        height="15"
                                                        alt="icon"
                                                        src="/images/svg/arrow-left-small.svg"
                                                        className="img-fluid u-image"
                                                    />
                                                </button>
                                            </li>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum = i + 1;
                                                if (currentPage > 3 && totalPages > 5) {
                                                    pageNum = currentPage - 2 + i;
                                                    if (pageNum > totalPages) return null;
                                                }
                                                return (
                                                    <li className="page-item" key={pageNum}>
                                                        <button
                                                            className={`page-link ${currentPage === pageNum ? "active" : ""
                                                                }`}
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            )}
                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <li className="page-item">
                                                    <button
                                                        className={`page-link ${currentPage === totalPages ? "active" : ""
                                                            }`}
                                                        onClick={() => handlePageChange(totalPages)}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </li>
                                            )}
                                            <li className="page-item">
                                                <button
                                                    className="page-link actionBtns"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <img
                                                        width="15"
                                                        height="15"
                                                        alt="icon"
                                                        src="/images/svg/arrow-right-small.svg"
                                                        className="img-fluid u-image"
                                                    />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {isHistoryModalOpen && selectedRecommendation && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Change History - {selectedRecommendation.recommendationNo}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsHistoryModalOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                {/* Recommendation Summary */}
                                <div className="mb-4 p-3 bg-light rounded">
                                    <h6 className="fw-bold mb-2">Recommendation Summary</h6>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <small className="text-muted">Description:</small>
                                            <p className="mb-2">{selectedRecommendation.recommendationDescription}</p>
                                        </div>
                                        <div className="col-md-1"></div>
                                        <div className="col-md-3">
                                            <small className="text-muted">Status:</small>
                                            <p className="mb-2">
                                                <span>
                                                    {selectedRecommendation.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted">Current Risk Score:</small>
                                            <p >
                                                {selectedRecommendation.finalRiskScore}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline History */}
                                <h6 className="fw-bold mb-3">Change Timeline</h6>
                                <div className="timeline-container">
                                    {getChangeHistory(selectedRecommendation.id).map((history, index) => (
                                        <div key={history.id} className="timeline-item mb-4 position-relative">

                                            <div className="timeline-content ms-4 ps-3 border-start border-2 border-primary">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <strong className="text-primary">{history.fieldName}</strong>
                                                        <span className="badge bg-secondary ms-2">{history.changeType.replace("_", " ").toUpperCase()}</span>
                                                    </div>
                                                    <small className="text-muted">{new Date(history.changedAt).toLocaleString()}</small>
                                                </div>

                                                {history.changeType === "creation" ? (
                                                    <p className="mb-2 text-success">
                                                        <strong>✨ Recommendation Created</strong>
                                                        <br />
                                                        <small className="text-muted">{history.newValue}</small>
                                                    </p>
                                                ) : (
                                                    <div className="change-details mb-2">
                                                        <div className="old-value text-muted text-decoration-line-through mb-1">
                                                            <small>Old: {history.oldValue || "—"}</small>
                                                        </div>
                                                        <div className="new-value text-success">
                                                            <strong>New: {history.newValue}</strong>
                                                        </div>
                                                    </div>
                                                )}

                                                {history.remarks && (
                                                    <div className="remarks mt-2">
                                                        <small className="text-muted">
                                                            <strong>Remarks:</strong> {history.remarks}
                                                        </small>
                                                    </div>
                                                )}

                                                <div className="changed-by mt-2">
                                                    <small className="text-muted">
                                                        <strong>Changed by:</strong> {history.changedBy}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {getChangeHistory(selectedRecommendation.id).length === 0 && (
                                        <div className="text-center text-muted py-4">
                                            No change history available for this recommendation.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsHistoryModalOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"

                                >
                                    Export History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered undefined">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Filter Recommendations</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsFilterOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="filters custom-modal">
                                    <div className="row g-3">
                                        <div className="form_grider d1 row g-2">
                                            <div className="col-md-4">
                                                <label className="form-label">Unit</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedUnit}
                                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                                >
                                                    <option value="">Select Unit</option>
                                                    {unitOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Department</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedDepartment}
                                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                                >
                                                    <option value="">Select Department</option>
                                                    {departmentOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                >
                                                    <option value="">Select Status</option>
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">From Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={fromDate}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">To Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={toDate}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setIsFilterOpen(false)}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add some custom CSS for timeline */}
            <style jsx>{`
        .timeline-container {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline-item {
          position: relative;
        }
        
        .timeline-item:last-child .border-start {
          border-left-color: transparent !important;
        }
        
        .change-details {
          background-color: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
        }
        
        .old-value {
          font-size: 0.9rem;
        }
        
        .new-value {
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .timeline-container {
            padding-left: 20px;
          }
          
          .timeline-badge {
            left: -25px !important;
          }
        }
      `}</style>
        </>
    );
};

export default RecommendationTracker;