interface Chemical {
  id: number;
  chemicalName: string;
  vendor: string;
  density: number;
  viscosity: number;
  packaging: string;
  packSize: number;
  unit: string;
  quantity: number;
}

class ChemicalSuppliesApp {
  private chemicals: Chemical[] = [];
  private table: HTMLTableElement;
  private addOverlay: HTMLElement;
  private addForm: HTMLFormElement;
  private editOverlay: HTMLElement;
  private editForm: HTMLFormElement;
  private sortDirection: boolean[] = [];

  constructor() {
    this.table = document.getElementById("chemicalTable") as HTMLTableElement;
    this.editOverlay = document.getElementById("editOverlay") as HTMLElement;
    this.editForm = document.getElementById("editForm") as HTMLFormElement;
    this.addOverlay = document.getElementById("addOverlay") as HTMLElement;
    this.addForm = document.getElementById("addForm") as HTMLFormElement;
    const numberOfColumns = this.table.querySelectorAll("th").length;
    this.sortDirection = Array(numberOfColumns).fill(false); // false for ascending, true for descending

    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.loadData();
      this.renderTable();
      this.initializeEventListeners();
    } catch (error) {
      console.error("Failed to initialize the application:", error);
    }
  }

  private async loadData(): Promise<void> {
    try {
      const response = await fetch(
        "https://shauryaswarup.github.io/IITBChallenge/data/data.json",
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.chemicals = await response.json();
      console.log(
        "Data loaded successfully:",
        this.chemicals.length,
        "chemicals",
      );
    } catch (error) {
      console.error("Error loading data:", error);
      throw error; // Re-throw to be caught in initialize()
    }
  }

  private initializeEventListeners(): void {
    const addRowButton = document.getElementById("addRow");
    if (addRowButton) {
      addRowButton.addEventListener("click", () => {
        console.log("Add Row button clicked");
        this.addRow();
      });
    } else {
      console.error("Add Row button not found");
    }

    const headers = this.table.querySelectorAll("th");
    headers.forEach((header, index) => {
      if (index > 0) {
        header.addEventListener("click", () =>
          this.sortTable(index, this.sortDirection[index]),
        );
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
    document
      .getElementById("moveDown")
      ?.addEventListener("click", () => this.moveRow("down"));
    document
      .getElementById("moveUp")
      ?.addEventListener("click", () => this.moveRow("up"));
    document
      .getElementById("deleteRow")
      ?.addEventListener("click", () => this.deleteRow());
    document
      .getElementById("refresh")
      ?.addEventListener("click", () => this.refreshData());
    document
      .getElementById("save")
      ?.addEventListener("click", () => this.saveData());
    document
      .getElementById("selectAll")
      ?.addEventListener("change", (e) =>
        this.selectAll((e.target as HTMLInputElement).checked),
      );
    document
      .getElementById("saveEdit")
      ?.addEventListener("click", () => this.saveEdit());
    document
      .getElementById("cancelEdit")
      ?.addEventListener("click", () => this.closeEditOverlay());
    document
      .getElementById("saveAdd")
      ?.addEventListener("click", () => this.saveAdd());
    document
      .getElementById("cancelEdit")
      ?.addEventListener("click", () => this.closeAddOverlay());
  }

  private renderTable(): void {
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
    } else {
      console.error("Table body not found");
    }
  }

  private addRow(): void {
    console.log("Adding new row");
    const newChemical: Chemical = {
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

  private moveRow(direction: "up" | "down"): void {
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
    } else if (direction === "down" && index < this.chemicals.length - 1) {
      [this.chemicals[index], this.chemicals[index + 1]] = [
        this.chemicals[index + 1],
        this.chemicals[index],
      ];
    }
    this.renderTable();
  }

  private deleteRow(): void {
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }

    if (confirm("Are you sure you want to delete the selected row(s)?")) {
      this.chemicals = this.chemicals.filter(
        (_, index) => !selectedRows.includes(index),
      );
      this.renderTable();
    }
  }

  private refreshData(): void {
    this.loadData();
  }

  private saveData(): void {
    // In a real application, you would send this data to a server
    console.log("Saving data:", this.chemicals);
    alert("Data saved successfully!");
  }

  private selectAll(checked: boolean): void {
    const checkboxes = this.table.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }

  private getSelectedRows(): number[] {
    const selectedRows: number[] = [];
    const checkboxes = this.table.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        selectedRows.push(index);
      }
    });
    return selectedRows;
  }

  private sortTable(columnIndex: number, toggle: boolean): void {
    // Toggle the sort direction
    this.sortDirection[columnIndex] = !this.sortDirection[columnIndex];

    const key = Object.keys(this.chemicals[0])[columnIndex] as keyof Chemical;
    this.chemicals.sort((a, b) => {
      if (a[key] < b[key]) return this.sortDirection[columnIndex] ? 1 : -1; // Descending
      if (a[key] > b[key]) return this.sortDirection[columnIndex] ? -1 : 1; // Ascending
      return 0;
    });
    this.renderTable();
  }

  private openEditOverlay(chemical: Chemical): void {
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

  private closeEditOverlay(): void {
    this.editOverlay.style.display = "none";
  }

  private saveEdit(): void {
    const formData = new FormData(this.editForm);
    const id = Number(formData.get("id"));
    const index = this.chemicals.findIndex((c) => c.id === id);

    if (index !== -1) {
      this.chemicals[index] = {
        id,
        chemicalName: formData.get("chemicalName") as string,
        vendor: formData.get("vendor") as string,
        density: Number(formData.get("density")),
        viscosity: Number(formData.get("viscosity")),
        packaging: formData.get("packaging") as string,
        packSize: Number(formData.get("packSize")),
        unit: formData.get("unit") as string,
        quantity: Number(formData.get("quantity")),
      };
      this.renderTable();
      this.closeEditOverlay();
    }
  }

  private openAddOverlay(chemical: Chemical): void {
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

  private closeAddOverlay(): void {
    this.addOverlay.style.display = "none";
  }

  private saveAdd(): void {
    const formData = new FormData(this.addForm);

    const chemicalName = formData.get("chemicalName") as string;
    const vendor = formData.get("vendor") as string;
    const density = Number(formData.get("density"));
    const viscosity = Number(formData.get("viscosity"));
    const packaging = formData.get("packaging") as string;
    const packSize = Number(formData.get("packSize"));
    const unit = formData.get("unit") as string;
    const quantity = Number(formData.get("quantity"));

    if (
      chemicalName &&
      vendor &&
      density > 0 &&
      viscosity > 0 &&
      packaging &&
      packSize > 0 &&
      unit &&
      quantity >= 0
    ) {
      const newChemical: Chemical = {
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
    } else {
      alert("Please fill in all fields correctly."); // Notify the user about missing fields
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  new ChemicalSuppliesApp();
});
