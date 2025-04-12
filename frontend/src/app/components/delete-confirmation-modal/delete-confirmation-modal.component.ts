import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-delete-confirmation-modal',
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrl: './delete-confirmation-modal.component.scss',
})
export class DeleteConfirmationModalComponent {
    @Output() confirmDelete = new EventEmitter<void>();

    onDelete() {
        this.confirmDelete.emit();
    }
}
