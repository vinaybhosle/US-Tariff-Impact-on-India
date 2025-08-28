// Dashboard Data and Functionality

const dashboardData = {
    // Volume data
    volume: {
        companies: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC", "Industry Average"],
        q1_actual: [3.305, 3.200, 2.800, 4.100, 3.350],
        q2_actual: [3.440, 3.300, 2.700, 4.000, 3.360],
        q3_forecast: [3.100, 3.000, 2.400, 3.700, 3.050],
        q4_forecast: [2.800, 2.700, 2.200, 3.400, 2.780],
        h1_growth: [10.6, 4.2, -0.3, 3.0, 4.4],
        h2_growth: [-13.8, -13.2, -14.3, -12.2, -13.4]
    },
    
    // Top 10 customers data
    topCustomers: {
        rank: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        company_name: ["Shahi Exports", "Welspun India", "Titan Company", "Bharat Forge", "Richa Global Exports", "Indo Count Industries", "Gokaldas Exports", "Rajesh Exports", "KPR Mill", "Trident Limited"],
        sector: ["Textiles & Apparel", "Home Textiles", "Gems & Jewelry", "Auto Components", "Garments & Apparel", "Home Textiles", "Apparel Manufacturing", "Gems & Jewelry", "Textiles & Garments", "Textiles & Home Products"],
        export_products: ["Garments, readymade clothing", "Bedding, home textile products", "Diamond jewelry, gold jewelry", "Automotive forging, components", "Export garments, clothing", "Bed linen, home textiles", "Branded apparels, garments", "Gold jewelry, diamond jewelry", "Yarn, fabric, garments", "Towels, bed linen, yarn"],
        export_value: [850, 420, 380, 320, 280, 250, 230, 200, 180, 150],
        dependency: [45, 35, 25, 30, 50, 40, 48, 22, 38, 35],
        impact_level: ["Critical", "High", "High", "Moderate", "Critical", "High", "Critical", "Moderate", "High", "High"],
        jobs_at_risk: [35, 22, 18, 15, 25, 16, 28, 12, 20, 18],
        locations: ["Bengaluru, NCR", "Maharashtra, Gujarat", "Mumbai, Delhi", "Pune, Maharashtra", "NCR, Punjab", "Maharashtra", "Bengaluru, Tamil Nadu", "Mumbai, Rajasthan", "Tamil Nadu", "Punjab, Haryana"],
        mitigation: ["Diversifying to EU, Middle East markets", "Expanding domestic market, exploring alternatives", "Reducing US exposure, focusing on domestic growth", "Shifting some production to Mexico under USMCA", "Exploring Bangladesh, Vietnam partnerships", "Market diversification to Europe, Australia", "Strengthening domestic brands, non-US markets", "Focusing on domestic market expansion", "Diversifying to other export destinations", "Expanding to domestic and alternative markets"]
    },
    
    // Industry impact data
    industry: {
        areas: ["Port Operations", "Supply Chain", "Logistics Costs", "Route Management", "Contract Terms"],
        descriptions: [
            "Port congestion and delays",
            "Tier 2/3 supplier disruption",
            "Insurance and warehousing cost increases",
            "Capacity reallocation and blank sailings",
            "Mid-term contract renegotiations"
        ],
        levels: ["High", "Critical", "Moderate", "High", "High"],
        costIncrease: [25, 40, 15, 20, 10],
        timeline: ["Immediate", "3-6 months", "Ongoing", "Q3-Q4 2025", "Immediate"],
        mitigation: [
            "Alternative port routing",
            "Supply chain mapping and diversification",
            "Operational efficiency improvements",
            "Fleet rebalancing to other trade lanes",
            "Force majeure clauses and price adjustments"
        ]
    },
    
    // Product impact data
    product: {
        sectors: ["Textiles & Apparel", "Seafood", "Gems & Jewelry", "Auto Components", "Chemicals", "Agriculture", "Steel & Aluminum", "Furniture"],
        exportValue: [10.8, 2.4, 10.0, 7.0, 3.0, 6.0, 4.7, 1.0],
        marketShare: [35, 32, 40, 25, 13, 20, 15, 59],
        tariffRate: [63.9, 58.6, 52.1, 50.0, 54.0, 50.0, 50.0, 52.9],
        volumeDrop: [70, 65, 60, 45, 55, 50, 25, 60],
        jobImpact: [500, 150, 400, 200, 100, 300, 50, 80],
        regions: [
            "Tirupur, NCR, Bengaluru",
            "Visakhapatnam", 
            "Surat, Mumbai",
            "Chennai, Pune",
            "Gujarat, Maharashtra",
            "Punjab, Haryana",
            "Odisha, Jharkhand",
            "Multiple clusters"
        ]
    }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Chart instances
let charts = {};

// Table sorting state
let sortState = {
    column: 'rank',
    direction: 'asc'
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    initializeTabs();
    initializeCharts();
    populateAllTables();
    setupEventListeners();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Show target tab content
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
    }
    
    // Initialize charts for the active tab if not already done
    setTimeout(() => {
        if (tabName === 'volume' && !charts.volume) {
            initializeVolumeChart();
        } else if (tabName === 'industry' && !charts.industry) {
            initializeIndustryChart();
        } else if (tabName === 'product') {
            if (!charts.product) {
                initializeProductChart();
            }
            if (!charts.jobImpact) {
                initializeJobImpactChart();
            }
        }
    }, 100);
}

// Chart Initialization
function initializeCharts() {
    // Initialize volume chart (default active tab)
    initializeVolumeChart();
}

function initializeVolumeChart() {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;
    
    const datasets = dashboardData.volume.companies.map((company, index) => ({
        label: company,
        data: [
            dashboardData.volume.q1_actual[index],
            dashboardData.volume.q2_actual[index],
            dashboardData.volume.q3_forecast[index],
            dashboardData.volume.q4_forecast[index]
        ],
        backgroundColor: chartColors[index],
        borderColor: chartColors[index],
        borderWidth: 2,
        pointRadius: 6,
        tension: 0.1
    }));

    charts.volume = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q1 2025 (Actual)', 'Q2 2025 (Actual)', 'Q3 2025 (Forecast)', 'Q4 2025 (Forecast)'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Quarterly Container Volume Trends (TTEU)',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Volume (TTEU)'
                    }
                }
            }
        }
    });
}

function initializeIndustryChart() {
    const ctx = document.getElementById('industryChart');
    if (!ctx) return;

    charts.industry = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dashboardData.industry.areas,
            datasets: [{
                data: dashboardData.industry.costIncrease,
                backgroundColor: chartColors.slice(0, 5),
                borderColor: chartColors.slice(0, 5),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Industry Cost Increase by Area (%)',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function initializeProductChart() {
    const ctx = document.getElementById('productChart');
    if (!ctx) return;

    charts.product = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.product.sectors,
            datasets: [{
                label: 'Export Value ($B)',
                data: dashboardData.product.exportValue,
                backgroundColor: chartColors[0],
                yAxisID: 'y'
            }, {
                label: 'Volume Drop (%)',
                data: dashboardData.product.volumeDrop,
                backgroundColor: chartColors[2],
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Sector Export Value vs Volume Drop',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Export Value ($B)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Volume Drop (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function initializeJobImpactChart() {
    const ctx = document.getElementById('jobImpactChart');
    if (!ctx) return;

    charts.jobImpact = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.product.sectors,
            datasets: [{
                label: 'Job Impact (Thousands)',
                data: dashboardData.product.jobImpact,
                backgroundColor: chartColors[3],
                borderColor: chartColors[3],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Job Impact by Sector (Thousands)',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jobs at Risk (Thousands)'
                    }
                }
            }
        }
    });
}

// Table Population
function populateAllTables() {
    populateVolumeTable();
    populateCustomersTable();
    populateIndustryTable();
    populateProductTable();
}

function populateVolumeTable() {
    const tableBody = document.getElementById('volume-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    dashboardData.volume.companies.forEach((company, index) => {
        const h1Total = dashboardData.volume.q1_actual[index] + dashboardData.volume.q2_actual[index];
        const h2Total = dashboardData.volume.q3_forecast[index] + dashboardData.volume.q4_forecast[index];
        const h1VsH2Change = ((h2Total - h1Total) / h1Total * 100);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="table-company">${company}</td>
            <td>${dashboardData.volume.q1_actual[index].toFixed(3)}</td>
            <td>${dashboardData.volume.q2_actual[index].toFixed(3)}</td>
            <td>${h1Total.toFixed(3)}</td>
            <td>${dashboardData.volume.q3_forecast[index].toFixed(3)}</td>
            <td>${dashboardData.volume.q4_forecast[index].toFixed(3)}</td>
            <td>${h2Total.toFixed(3)}</td>
            <td class="${h1VsH2Change < 0 ? 'table-negative' : 'table-positive'}">${h1VsH2Change > 0 ? '+' : ''}${h1VsH2Change.toFixed(1)}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function populateCustomersTable(filteredData = null) {
    const tableBody = document.getElementById('customers-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const data = filteredData || dashboardData.topCustomers;
    const dataLength = data.rank ? data.rank.length : 0;
    
    for (let i = 0; i < dataLength; i++) {
        const row = document.createElement('tr');
        const impactClass = getImpactClass(data.impact_level[i]);
        
        row.innerHTML = `
            <td>${data.rank[i]}</td>
            <td class="table-company">${data.company_name[i]}</td>
            <td>${data.sector[i]}</td>
            <td>${data.export_products[i]}</td>
            <td class="table-negative">$${data.export_value[i]}M</td>
            <td>${data.dependency[i]}%</td>
            <td><span class="${impactClass}">${data.impact_level[i]}</span></td>
            <td class="table-negative">${data.jobs_at_risk[i]}K</td>
            <td>${data.locations[i]}</td>
            <td style="max-width: 200px; font-size: 11px;">${data.mitigation[i]}</td>
        `;
        tableBody.appendChild(row);
    }
}

function populateIndustryTable() {
    const tableBody = document.getElementById('industry-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    dashboardData.industry.areas.forEach((area, index) => {
        const row = document.createElement('tr');
        const levelClass = getSeverityClass(dashboardData.industry.levels[index]);
        
        row.innerHTML = `
            <td class="table-company">${area}</td>
            <td>${dashboardData.industry.descriptions[index]}</td>
            <td class="table-negative">+${dashboardData.industry.costIncrease[index]}%</td>
            <td>${dashboardData.industry.timeline[index]}</td>
            <td><span class="status ${levelClass}">${dashboardData.industry.levels[index]}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function populateProductTable() {
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    dashboardData.product.sectors.forEach((sector, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="table-company">${sector}</td>
            <td>${dashboardData.product.exportValue[index].toFixed(1)}</td>
            <td>${dashboardData.product.marketShare[index]}%</td>
            <td class="table-negative">${dashboardData.product.tariffRate[index]}%</td>
            <td class="table-negative">${dashboardData.product.volumeDrop[index]}%</td>
            <td class="table-negative">${dashboardData.product.jobImpact[index]}K</td>
            <td>${dashboardData.product.regions[index]}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Event Listeners
function setupEventListeners() {
    // Company selector for volume tab
    const companySelect = document.getElementById('company-select');
    if (companySelect) {
        companySelect.addEventListener('change', handleCompanySelection);
    }
    
    // Search functionality for customers table
    const customerSearch = document.getElementById('customer-search');
    if (customerSearch) {
        customerSearch.addEventListener('input', handleCustomerSearch);
    }
    
    // Table sorting for customers table
    const customerTable = document.querySelector('.customers-table');
    if (customerTable) {
        const headers = customerTable.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-sort');
                handleTableSort(column);
            });
        });
    }
}

function handleCompanySelection(event) {
    const selectedValue = event.target.value;
    updateVolumeChart(selectedValue);
}

function handleCustomerSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (!searchTerm) {
        populateCustomersTable();
        return;
    }
    
    const filteredData = {
        rank: [],
        company_name: [],
        sector: [],
        export_products: [],
        export_value: [],
        dependency: [],
        impact_level: [],
        jobs_at_risk: [],
        locations: [],
        mitigation: []
    };
    
    dashboardData.topCustomers.company_name.forEach((company, index) => {
        const matchesCompany = company.toLowerCase().includes(searchTerm);
        const matchesSector = dashboardData.topCustomers.sector[index].toLowerCase().includes(searchTerm);
        const matchesProducts = dashboardData.topCustomers.export_products[index].toLowerCase().includes(searchTerm);
        const matchesImpact = dashboardData.topCustomers.impact_level[index].toLowerCase().includes(searchTerm);
        
        if (matchesCompany || matchesSector || matchesProducts || matchesImpact) {
            Object.keys(filteredData).forEach(key => {
                filteredData[key].push(dashboardData.topCustomers[key][index]);
            });
        }
    });
    
    populateCustomersTable(filteredData);
}

function handleTableSort(column) {
    // Toggle sort direction
    if (sortState.column === column) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.column = column;
        sortState.direction = 'asc';
    }
    
    // Update header styling
    document.querySelectorAll('.customers-table th[data-sort]').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    const activeHeader = document.querySelector(`[data-sort="${column}"]`);
    if (activeHeader) {
        activeHeader.classList.add(`sort-${sortState.direction}`);
    }
    
    // Sort the data
    const sortedData = sortCustomersData(column, sortState.direction);
    populateCustomersTable(sortedData);
}

function sortCustomersData(column, direction) {
    const indices = Array.from({length: dashboardData.topCustomers.rank.length}, (_, i) => i);
    
    indices.sort((a, b) => {
        let valueA, valueB;
        
        switch(column) {
            case 'rank':
                valueA = dashboardData.topCustomers.rank[a];
                valueB = dashboardData.topCustomers.rank[b];
                break;
            case 'company':
                valueA = dashboardData.topCustomers.company_name[a];
                valueB = dashboardData.topCustomers.company_name[b];
                break;
            case 'sector':
                valueA = dashboardData.topCustomers.sector[a];
                valueB = dashboardData.topCustomers.sector[b];
                break;
            case 'value':
                valueA = dashboardData.topCustomers.export_value[a];
                valueB = dashboardData.topCustomers.export_value[b];
                break;
            case 'dependency':
                valueA = dashboardData.topCustomers.dependency[a];
                valueB = dashboardData.topCustomers.dependency[b];
                break;
            case 'impact':
                const impactOrder = {'Critical': 3, 'High': 2, 'Moderate': 1};
                valueA = impactOrder[dashboardData.topCustomers.impact_level[a]];
                valueB = impactOrder[dashboardData.topCustomers.impact_level[b]];
                break;
            case 'jobs':
                valueA = dashboardData.topCustomers.jobs_at_risk[a];
                valueB = dashboardData.topCustomers.jobs_at_risk[b];
                break;
            default:
                return 0;
        }
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }
        
        if (direction === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
    });
    
    // Create sorted data object
    const sortedData = {
        rank: [],
        company_name: [],
        sector: [],
        export_products: [],
        export_value: [],
        dependency: [],
        impact_level: [],
        jobs_at_risk: [],
        locations: [],
        mitigation: []
    };
    
    indices.forEach(index => {
        Object.keys(sortedData).forEach(key => {
            sortedData[key].push(dashboardData.topCustomers[key][index]);
        });
    });
    
    return sortedData;
}

function updateVolumeChart(selectedValue) {
    if (!charts.volume) return;
    
    const datasets = [];
    
    if (selectedValue === 'all') {
        dashboardData.volume.companies.forEach((company, index) => {
            datasets.push(createVolumeDataset(company, index, false));
        });
    } else {
        const companyIndex = parseInt(selectedValue);
        const company = dashboardData.volume.companies[companyIndex];
        datasets.push(createVolumeDataset(company, companyIndex, true));
    }
    
    charts.volume.data.datasets = datasets;
    charts.volume.update('active');
}

function createVolumeDataset(company, index, isSelected) {
    return {
        label: company,
        data: [
            dashboardData.volume.q1_actual[index],
            dashboardData.volume.q2_actual[index],
            dashboardData.volume.q3_forecast[index],
            dashboardData.volume.q4_forecast[index]
        ],
        backgroundColor: chartColors[index],
        borderColor: chartColors[index],
        borderWidth: isSelected ? 4 : 2,
        pointRadius: isSelected ? 8 : 6,
        tension: 0.1
    };
}

// Utility Functions
function getSeverityClass(severity) {
    switch(severity.toLowerCase()) {
        case 'critical': return 'status--error';
        case 'high': return 'status--warning';
        case 'moderate': return 'status--info';
        default: return 'status--info';
    }
}

function getImpactClass(impact) {
    switch(impact.toLowerCase()) {
        case 'critical': return 'impact-critical';
        case 'high': return 'impact-high';
        case 'moderate': return 'impact-moderate';
        default: return 'impact-moderate';
    }
}

// Export for potential future use
window.dashboardData = dashboardData;