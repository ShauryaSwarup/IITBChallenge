"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ChemicalSuppliesApp {
    constructor() {
        this.chemicals = [];
        this.sortDirection = [];
        this.table = document.getElementById("chemicalTable");
        this.editOverlay = document.getElementById("editOverlay");
        this.editForm = document.getElementById("editForm");
        this.addOverlay = document.getElementById("addOverlay");
        this.addForm = document.getElementById("addForm");
        const numberOfColumns = this.table.querySelectorAll("th").length;
        this.sortDirection = Array(numberOfColumns).fill(false); // false for ascending, true for descending
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.loadData();
                this.renderTable();
                this.initializeEventListeners();
            }
            catch (error) {
                console.error("Failed to initialize the application:", error);
            }
        });
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("https://shauryaswarup.github.io/IITBChallenge/data/data.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.chemicals = yield response.json();
                console.log("Data loaded successfully:", this.chemicals.length, "chemicals");
            }
            catch (error) {
                console.error("Error loading data:", error);
                throw error; // Re-throw to be caught in initialize()
            }
        });
    }
    initializeEventListeners() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const addRowButton = document.getElementById("addRow");
        if (addRowButton) {
            addRowButton.addEventListener("click", () => {
                console.log("Add Row button clicked");
                this.addRow();
            });
        }
        else {
            console.error("Add Row button not found");
        }
        const headers = this.table.querySelectorAll("th");
        headers.forEach((header, index) => {
            if (index > 0) {
                header.addEventListener("click", () => this.sortTable(index, this.sortDirection[index]));
            }
        });
        this.editOverlay.addEventListener("click", (event) => {
            if (event.target === this.editOverlay) {
                this.closeEditOverlay();
            }
        });
        this.addOverlay.addEventListener("click", (event) => {
            if (event.target === this.addOverlay) {
                this.closeAddOverlay();
            }
        });
        (_a = document
            .getElementById("moveDown")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.moveRow("down"));
        (_b = document
            .getElementById("moveUp")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.moveRow("up"));
        (_c = document
            .getElementById("deleteRow")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.deleteRow());
        (_d = document
            .getElementById("refresh")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.refreshData());
        (_e = document
            .getElementById("save")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => this.saveData());
        (_f = document
            .getElementById("selectAll")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", (e) => this.selectAll(e.target.checked));
        (_g = document
            .getElementById("saveEdit")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => this.saveEdit());
        (_h = document
            .getElementById("cancelEdit")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => this.closeEditOverlay());
        (_j = document
            .getElementById("saveAdd")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", () => this.saveAdd());
        (_k = document
            .getElementById("cancelEdit")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", () => this.closeAddOverlay());
    }
    renderTable() {
        console.log("Rendering table with", this.chemicals.length, "chemicals");
        const tbody = this.table.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            this.chemicals.forEach((chemical, index) => {
                const row = tbody.insertRow();
                row.innerHTML = `
    <td>
        <label>
            <input type="checkbox" data-id="${chemical.id}" />
            <span class="tickmark"></span>
        </label>
    </td>
    <td>${chemical.chemicalName}</td>
    <td>${chemical.vendor}</td>
    <td>${chemical.density}</td>
    <td>${chemical.viscosity}</td>
    <td>${chemical.packaging}</td>
    <td>${chemical.packSize}</td>
    <td>${chemical.unit}</td>
    <td>${chemical.quantity}</td>
    `;
                row.addEventListener("click", () => this.openEditOverlay(chemical));
            });
        }
        else {
            console.error("Table body not found");
        }
    }
    addRow() {
        console.log("Adding new row");
        const newChemical = {
            id: this.chemicals.length + 1,
            chemicalName: "",
            vendor: "",
            density: 0,
            viscosity: 0,
            packaging: "",
            packSize: 0,
            unit: "",
            quantity: 0,
        };
        this.openAddOverlay(newChemical);
    }
    moveRow(direction) {
        const selectedRows = this.getSelectedRows();
        if (selectedRows.length !== 1) {
            alert("Please select exactly one row to move.");
            return;
        }
        const index = selectedRows[0];
        if (direction === "up" && index > 0) {
            [this.chemicals[index - 1], this.chemicals[index]] = [
                this.chemicals[index],
                this.chemicals[index - 1],
            ];
        }
        else if (direction === "down" && index < this.chemicals.length - 1) {
            [this.chemicals[index], this.chemicals[index + 1]] = [
                this.chemicals[index + 1],
                this.chemicals[index],
            ];
        }
        this.renderTable();
    }
    deleteRow() {
        const selectedRows = this.getSelectedRows();
        if (selectedRows.length === 0) {
            alert("Please select at least one row to delete.");
            return;
        }
        if (confirm("Are you sure you want to delete the selected row(s)?")) {
            this.chemicals = this.chemicals.filter((_, index) => !selectedRows.includes(index));
            this.renderTable();
        }
    }
    refreshData() {
        this.loadData();
    }
    saveData() {
        // In a real application, you would send this data to a server
        console.log("Saving data:", this.chemicals);
        alert("Data saved successfully!");
    }
    selectAll(checked) {
        const checkboxes = this.table.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = checked;
        });
    }
    getSelectedRows() {
        const selectedRows = [];
        const checkboxes = this.table.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                selectedRows.push(index);
            }
        });
        return selectedRows;
    }
    sortTable(columnIndex, toggle) {
        // Toggle the sort direction
        this.sortDirection[columnIndex] = !this.sortDirection[columnIndex];
        const key = Object.keys(this.chemicals[0])[columnIndex];
        this.chemicals.sort((a, b) => {
            if (a[key] < b[key])
                return this.sortDirection[columnIndex] ? 1 : -1; // Descending
            if (a[key] > b[key])
                return this.sortDirection[columnIndex] ? -1 : 1; // Ascending
            return 0;
        });
        this.renderTable();
    }
    openEditOverlay(chemical) {
        this.editForm.innerHTML = `
            <input type="hidden" name="id" value="${chemical.id}">
            <label>Chemical Name: <input type="text" name="chemicalName" value="${chemical.chemicalName}"></label>
            <label>Vendor: <input type="text" name="vendor" value="${chemical.vendor}"></label>
            <label>Density: <input type="number" name="density" value="${chemical.density}"></label>
            <label>Viscosity: <input type="number" name="viscosity" value="${chemical.viscosity}"></label>
            <label>Packaging: <input type="text" name="packaging" value="${chemical.packaging}"></label>
            <label>Pack Size: <input type="number" name="packSize" value="${chemical.packSize}"></label>
            <label>Unit: <input type="text" name="unit" value="${chemical.unit}"></label>
            <label>Quantity: <input type="number" name="quantity" value="${chemical.quantity}"></label>
        `;
        this.editOverlay.style.display = "flex";
    }
    closeEditOverlay() {
        this.editOverlay.style.display = "none";
    }
    saveEdit() {
        const formData = new FormData(this.editForm);
        const id = Number(formData.get("id"));
        const index = this.chemicals.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.chemicals[index] = {
                id,
                chemicalName: formData.get("chemicalName"),
                vendor: formData.get("vendor"),
                density: Number(formData.get("density")),
                viscosity: Number(formData.get("viscosity")),
                packaging: formData.get("packaging"),
                packSize: Number(formData.get("packSize")),
                unit: formData.get("unit"),
                quantity: Number(formData.get("quantity")),
            };
            this.renderTable();
            this.closeEditOverlay();
        }
    }
    openAddOverlay(chemical) {
        this.addForm.innerHTML = `
            <input type="hidden" name="id" value="${chemical.id}">
            <label>Chemical Name: <input type="text" name="chemicalName" value="${chemical.chemicalName}"></label>
            <label>Vendor: <input type="text" name="vendor" value="${chemical.vendor}"></label>
            <label>Density: <input type="number" name="density" value="${chemical.density}"></label>
            <label>Viscosity: <input type="number" name="viscosity" value="${chemical.viscosity}"></label>
            <label>Packaging: <input type="text" name="packaging" value="${chemical.packaging}"></label>
            <label>Pack Size: <input type="number" name="packSize" value="${chemical.packSize}"></label>
            <label>Unit: <input type="text" name="unit" value="${chemical.unit}"></label>
            <label>Quantity: <input type="number" name="quantity" value="${chemical.quantity}"></label>
        `;
        this.addOverlay.style.display = "flex";
    }
    closeAddOverlay() {
        this.addOverlay.style.display = "none";
    }
    saveAdd() {
        const formData = new FormData(this.addForm);
        const chemicalName = formData.get("chemicalName");
        const vendor = formData.get("vendor");
        const density = Number(formData.get("density"));
        const viscosity = Number(formData.get("viscosity"));
        const packaging = formData.get("packaging");
        const packSize = Number(formData.get("packSize"));
        const unit = formData.get("unit");
        const quantity = Number(formData.get("quantity"));
        if (chemicalName &&
            vendor &&
            density > 0 &&
            viscosity > 0 &&
            packaging &&
            packSize > 0 &&
            unit &&
            quantity >= 0) {
            const newChemical = {
                id: this.chemicals.length + 1,
                chemicalName,
                vendor,
                density,
                viscosity,
                packaging,
                packSize,
                unit,
                quantity,
            };
            this.chemicals.push(newChemical);
            this.renderTable();
            this.closeAddOverlay();
        }
        else {
            alert("Please fill in all fields correctly."); // Notify the user about missing fields
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    new ChemicalSuppliesApp();
});
