import tkinter as tk
from tkinter import ttk

# defining the color (optional)
RED = "#FF0000"

class TransparentRedWindow(tk.Tk):
    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self, *args, **kwargs)
        self.wm_title("Simple Transparent GUI")
        self.overrideredirect(True)  # This will remove the title bar and make the window fullscreen
        self.bind('<Escape>', self.on_escape)

        # Bind mouse events for moving, resizing, and hovering
        self.bind('<ButtonPress-1>', self.on_mouse_press)
        self.bind('<B1-Motion>', self.on_mouse_drag)
        self.bind('<Motion>', self.on_mouse_move)

        self.create_border()  # Add the border

    def create_border(self):
        # Create a new canvas on top of the window to draw the border
        self.border_canvas = tk.Canvas(self, highlightthickness=5, highlightbackground=RED)
        self.border_canvas.place(x=0, y=0, relwidth=1, relheight=1)  # Place the canvas on the entire window

        self.resize_flag = False  # Initialize resize flag
        self.cursor = 'arrow'  # Set default cursor

    def on_mouse_press(self, event):
        # Save the mouse press coordinates and window size
        self.start_x = event.x
        self.start_y = event.y
        self.start_width = self.winfo_width()
        self.start_height = self.winfo_height()

    def on_mouse_drag(self, event):
        if self.resize_flag:
            # Resize the window
            new_width = self.start_width + (event.x - self.start_x)
            new_height = self.start_height + (event.y - self.start_y)
            self.geometry(f"{new_width}x{new_height}")
        else:
            # Move the window
            x = event.x_root - self.start_x
            y = event.y_root - self.start_y
            self.geometry(f"+{x}+{y}")

    def on_mouse_move(self, event):
        # Check if the cursor is within 5 pixels of any edge for resizing
        x_within_5 = 0 <= event.x <= 5 or self.winfo_width() - 5 <= event.x <= self.winfo_width()
        y_within_5 = 0 <= event.y <= 5 or self.winfo_height() - 5 <= event.y <= self.winfo_height()

        if x_within_5 or y_within_5:
            self.cursor = 'sizing'  # Change cursor to sizing icon
            self.border_canvas.config(cursor=self.cursor)
            self.resize_flag = True  # Set flag to initiate resizing
        else:
            self.cursor = 'arrow'  # Reset cursor to arrow
            self.border_canvas.config(cursor=self.cursor)
            self.resize_flag = False  # Disable resizing

    def on_escape(self, event):
        self.destroy()

root = TransparentRedWindow()
root.wm_attributes('-alpha', 0.5)  # Set the alpha value
root.mainloop()