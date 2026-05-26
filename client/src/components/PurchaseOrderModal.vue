<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ mode === 'create' ? 'Create Purchase Order' : 'Purchase Order Details' }}
            </h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Backlog item context banner -->
            <div class="context-banner">
              <div class="context-info">
                <span class="context-label">Item</span>
                <span class="context-value">{{ backlogItem.item_name }}</span>
              </div>
              <div class="context-info">
                <span class="context-label">SKU</span>
                <span class="context-value sku">{{ backlogItem.item_sku }}</span>
              </div>
              <div class="context-info">
                <span class="context-label">Shortage</span>
                <span class="context-value shortage">
                  {{ backlogItem.quantity_needed - backlogItem.quantity_available }} units
                </span>
              </div>
            </div>

            <!-- Create mode: form -->
            <form v-if="mode === 'create'" class="po-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label class="form-label" for="supplier-name">Supplier Name <span class="required">*</span></label>
                <input
                  id="supplier-name"
                  v-model="form.supplier_name"
                  type="text"
                  class="form-input"
                  placeholder="Enter supplier name"
                  required
                  :disabled="submitting"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="quantity">Quantity <span class="required">*</span></label>
                  <input
                    id="quantity"
                    v-model.number="form.quantity"
                    type="number"
                    class="form-input"
                    min="1"
                    required
                    :disabled="submitting"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="unit-cost">Unit Cost (USD) <span class="required">*</span></label>
                  <input
                    id="unit-cost"
                    v-model.number="form.unit_cost"
                    type="number"
                    class="form-input"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                    :disabled="submitting"
                  />
                </div>
              </div>

              <!-- Total cost preview -->
              <div v-if="form.quantity && form.unit_cost" class="total-preview">
                <span class="total-label">Estimated Total</span>
                <span class="total-value">{{ formatCurrency(form.quantity * form.unit_cost) }}</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="delivery-date">Expected Delivery Date <span class="required">*</span></label>
                <input
                  id="delivery-date"
                  v-model="form.expected_delivery_date"
                  type="date"
                  class="form-input"
                  required
                  :disabled="submitting"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="notes">Notes</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-textarea"
                  placeholder="Optional notes for this purchase order"
                  rows="3"
                  :disabled="submitting"
                ></textarea>
              </div>

              <div v-if="submitError" class="error-message">
                {{ submitError }}
              </div>
            </form>

            <!-- View mode: read-only details -->
            <div v-else-if="mode === 'view'">
              <div v-if="viewLoading" class="view-loading">Loading purchase order...</div>
              <div v-else-if="viewError" class="error-message">{{ viewError }}</div>
              <div v-else-if="existingPO" class="po-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">Supplier</div>
                    <div class="detail-value">{{ existingPO.supplier_name }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                      <span class="status-badge" :class="existingPO.status">{{ existingPO.status }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Quantity</div>
                    <div class="detail-value">{{ existingPO.quantity }} units</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Unit Cost</div>
                    <div class="detail-value">{{ formatCurrency(existingPO.unit_cost) }}</div>
                  </div>
                  <div class="detail-item highlight">
                    <div class="detail-label">Total Value</div>
                    <div class="detail-value total">{{ formatCurrency(existingPO.quantity * existingPO.unit_cost) }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Expected Delivery</div>
                    <div class="detail-value">{{ formatDate(existingPO.expected_delivery_date) }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Created</div>
                    <div class="detail-value">{{ formatDate(existingPO.created_date) }}</div>
                  </div>
                  <div v-if="existingPO.notes" class="detail-item full-width">
                    <div class="detail-label">Notes</div>
                    <div class="detail-value notes">{{ existingPO.notes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <template v-if="mode === 'create'">
              <button class="btn-secondary" @click="close" :disabled="submitting">Cancel</button>
              <button
                class="btn-primary"
                :disabled="submitting"
                @click="submitForm"
              >
                {{ submitting ? 'Creating...' : 'Create Purchase Order' }}
              </button>
            </template>
            <template v-else>
              <button class="btn-secondary" @click="close">Close</button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { api } from '../api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  backlogItem: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['close', 'po-created'])

// Create mode state
const form = ref({
  supplier_name: '',
  quantity: 0,
  unit_cost: null,
  expected_delivery_date: '',
  notes: ''
})
const submitting = ref(false)
const submitError = ref(null)

// View mode state
const existingPO = ref(null)
const viewLoading = ref(false)
const viewError = ref(null)

// Reset create form when modal opens in create mode
watch(
  () => props.isOpen,
  (open) => {
    if (open && props.backlogItem) {
      if (props.mode === 'create') {
        // Default quantity to the shortage amount
        const shortage = props.backlogItem.quantity_needed - props.backlogItem.quantity_available
        form.value = {
          supplier_name: '',
          quantity: shortage > 0 ? shortage : 1,
          unit_cost: null,
          expected_delivery_date: '',
          notes: ''
        }
        submitError.value = null
      } else if (props.mode === 'view') {
        loadExistingPO()
      }
    }
  }
)

// Also react if mode changes while already open
watch(
  () => props.mode,
  (newMode) => {
    if (props.isOpen && props.backlogItem && newMode === 'view') {
      loadExistingPO()
    }
  }
)

const loadExistingPO = async () => {
  viewLoading.value = true
  viewError.value = null
  existingPO.value = null
  try {
    existingPO.value = await api.getPurchaseOrderByBacklogItem(props.backlogItem.id)
  } catch (err) {
    viewError.value = 'Failed to load purchase order details'
  } finally {
    viewLoading.value = false
  }
}

const submitForm = async () => {
  if (submitting.value) return
  submitting.value = true
  submitError.value = null

  try {
    const payload = {
      backlog_item_id: props.backlogItem.id,
      supplier_name: form.value.supplier_name,
      quantity: form.value.quantity,
      unit_cost: form.value.unit_cost,
      expected_delivery_date: form.value.expected_delivery_date,
    }
    // Only include notes if non-empty
    if (form.value.notes && form.value.notes.trim()) {
      payload.notes = form.value.notes.trim()
    }

    const createdPO = await api.createPurchaseOrder(payload)
    emit('po-created', createdPO)
  } catch (err) {
    submitError.value = err?.response?.data?.detail || 'Failed to create purchase order. Please try again.'
  } finally {
    submitting.value = false
  }
}

const close = () => {
  if (!submitting.value) {
    emit('close')
  }
}

const handleOverlayClick = () => {
  close()
}

// Close on Escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return '$0.00'
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-default);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.close-button:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.context-banner {
  display: flex;
  gap: 1.5rem;
  padding: 0.875rem 1rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.context-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.context-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.context-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.context-value.sku {
  font-family: 'Monaco', 'Courier New', monospace;
  color: var(--accent);
}

.context-value.shortage {
  color: var(--danger-text);
}

/* Form styles */
.po-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.required {
  color: var(--danger-solid);
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--text-primary);
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: var(--bg-surface);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}

.form-input:disabled {
  background: var(--bg-hover);
  color: var(--text-muted);
  cursor: not-allowed;
}

.form-textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 72px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: var(--bg-surface);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}

.form-textarea:disabled {
  background: var(--bg-hover);
  color: var(--text-muted);
  cursor: not-allowed;
}

.total-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--info-bg);
  border: 1px solid var(--info-bg);
  border-radius: var(--radius-md);
}

.total-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--info-text);
}

.total-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--info-text);
}

.error-message {
  padding: 0.75rem 1rem;
  background: var(--danger-bg);
  border: 1px solid var(--danger-bg);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--danger-text);
}

/* View mode styles */
.view-loading {
  padding: 2rem;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.po-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.detail-item.highlight {
  background: var(--info-bg);
  border-color: var(--info-bg);
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}

.detail-value {
  font-size: 0.938rem;
  font-weight: 500;
  color: var(--text-primary);
}

.detail-value.total {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--info-text);
}

.detail-value.notes {
  color: var(--text-secondary);
  line-height: 1.5;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-xs);
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.status-badge.approved {
  background: var(--info-bg);
  color: var(--info-text);
}

.status-badge.ordered {
  background: var(--info-bg);
  color: var(--info-text);
}

.status-badge.received {
  background: var(--success-bg);
  color: var(--success-text);
}

.status-badge.cancelled {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

/* Modal footer */
.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-default);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.625rem 1.25rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-fast);
  font-family: inherit;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: var(--transition-fast);
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
