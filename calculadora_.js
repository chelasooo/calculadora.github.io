import tkinter as tk
from tkinter import messagebox
import math

class InitialWindow(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Seleccione el tipo de cálculo")
        self.geometry("300x200")
        self.center_window(300, 200)

        tk.Label(self, text="Seleccione el tipo de cálculo:").pack()
        self.selected_calculation = tk.StringVar()

        tk.Radiobutton(self, text="Ácido Fuerte", variable=self.selected_calculation, value="AcidoFuerte").pack()
        tk.Radiobutton(self, text="Ácido Débil", variable=self.selected_calculation, value="AcidoDebil").pack()
        tk.Radiobutton(self, text="Base Fuerte", variable=self.selected_calculation, value="BaseFuerte").pack()
        tk.Radiobutton(self, text="Base Débil", variable=self.selected_calculation, value="BaseDebil").pack()

        tk.Button(self, text="Continuar", command=self.continue_to_calculator).pack()

    def center_window(self, width, height):
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

    def continue_to_calculator(self):
        selected_calculation = self.selected_calculation.get()
        if selected_calculation == "AcidoFuerte":
            self.destroy()
            app = PHCalculator("Ácido Fuerte")
            app.mainloop()
        elif selected_calculation == "AcidoDebil":
            self.destroy()
            app = PHCalculator("Ácido Débil")
            app.mainloop()
        elif selected_calculation == "BaseFuerte":
            self.destroy()
            app = PHCalculator("Base Fuerte")
            app.mainloop()
        elif selected_calculation == "BaseDebil":
            self.destroy()
            app = PHCalculator("Base Débil")
            app.mainloop()
        else:
            messagebox.showerror("Error", "Por favor, seleccione un tipo de cálculo.")

class PHCalculator(tk.Tk):
    def __init__(self, calculation_type):
        super().__init__()
        self.title(f"Calculadora de pH - {calculation_type}")
        self.geometry("400x450")
        self.center_window(400, 450)

        self.calculation_type = calculation_type
        self.create_widgets()

    def center_window(self, width, height):
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

    def create_widgets(self):
        tk.Label(self, text=f"Cálculo de {self.calculation_type}").pack()

        self.concentration_label = tk.Label(self, text="Concentración (M):")
        self.concentration_label.pack()
        self.concentration_entry = tk.Entry(self)
        self.concentration_entry.pack()

        if "Débil" in self.calculation_type:
            self.constant_label = tk.Label(self, text="Constante de equilibrio:")
            self.constant_label.pack()
            self.constant_entry = tk.Entry(self)
            self.constant_entry.pack()

        self.calculate_button = tk.Button(self, text="Calcular", command=self.calculate_ph)
        self.calculate_button.pack()

        self.ph_label = tk.Label(self, text="pH: ")
        self.ph_label.pack()
        self.poh_label = tk.Label(self, text="pOH: ")
        self.poh_label.pack()
        self.h_plus_label = tk.Label(self, text="[H+]: ")
        self.h_plus_label.pack()
        self.oh_minus_label = tk.Label(self, text="[OH-]: ")
        self.oh_minus_label.pack()
        


    def calculate_ph(self):
        try:
            concentration = float(self.concentration_entry.get())
            if "Débil" in self.calculation_type:
                constant = float(self.constant_entry.get())
            else:
                constant = 0

            h_plus = 0
            oh_minus = 0
            ph = 0
            poh = 0

            if "Ácido" in self.calculation_type:
                if "Fuerte" in self.calculation_type:
                    oh_minus = concentration
                    h_plus = 1e-14 / oh_minus
                    ph = 14 + math.log10(oh_minus)
                    poh = 14 - ph
                else:  # Ácido Débil
                    h_plus = math.sqrt(constant * concentration)
                    ph = -math.log10(h_plus)
                    oh_minus = 1e-14 / h_plus
                    poh = 14 - ph
            else:  # Base
                if "Fuerte" in self.calculation_type:
                    oh_minus = concentration
                    h_plus = 1e-14 / oh_minus
                    ph = 14 + math.log10(oh_minus)
                    poh = 14 - ph
                else:  # Base Débil
                    h_plus = math.sqrt(constant * concentration)
                    ph = -math.log10(h_plus)
                    oh_minus = 1e-14 / h_plus
                    poh = 14 - ph

            self.ph_label.config(text=f"pH: {ph:.4f}")
            self.poh_label.config(text=f"pOH: {poh:.4f}")
            self.h_plus_label.config(text=f"[H+]: {h_plus:.4e}")
            self.oh_minus_label.config(text=f"[OH-]: {oh_minus:.4e}")
        except ValueError:
            messagebox.showerror("Error", "Por favor, ingrese valores válidos.")

if __name__ == "__main__":
    app = InitialWindow()
    app.mainloop()
