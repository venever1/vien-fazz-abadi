import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  createCompanyWithInvoice,
  type CompanyWithInvoiceValidationErrors,
  validateCompanyWithInvoiceInput,
} from '../../application/companies/createCompanyWithInvoice';
import { getProducts } from '../../services/repositories/productRepository';
import type { Product } from '../../types';
import { Button, Modal, TextInput, useToast } from '../common';

interface AddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCompanyModal = ({ open, onClose, onSuccess }: AddCompanyModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [productId, setProductId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Belum Bayar' | 'Cicilan' | 'Lunas'>('Belum Bayar');

  const [errors, setErrors] = useState<CompanyWithInvoiceValidationErrors>({});

  useEffect(() => {
    if (open) {
      setLoadingProducts(true);
      getProducts()
        .then((list) => {
          setProducts(list);
          if (list.length > 0 && !productId) {
            setProductId(list[0].id);
          }
        })
        .catch(() => {
          showToast('Gagal memuat produk.', 'error');
        })
        .finally(() => {
          setLoadingProducts(false);
        });
    }
  }, [open, productId, showToast]);

  const resetForm = () => {
    setCompanyName('');
    setBusinessDesc('');
    setTotalAmount('');
    setDueDate('');
    setStatus('Belum Bayar');
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amountNum = Number(totalAmount);
    const validationErrors = validateCompanyWithInvoiceInput({
      company_name: companyName,
      product_id: productId,
      total_amount: amountNum,
      due_date: dueDate,
      status,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await createCompanyWithInvoice({
        company_name: companyName,
        business_description: businessDesc,
        product_id: productId,
        total_amount: amountNum,
        due_date: dueDate,
        status,
      });

      showToast('Perusahaan berhasil ditambahkan.', 'success');
      resetForm();
      onSuccess();
      onClose();
    } catch {
      showToast('Data gagal disimpan.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Tambah Perusahaan & Tagihan"
      hint="Masukkan data perusahaan dan rincian tagihan awal."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting || loadingProducts}>
            {submitting ? 'Menyimpan...' : 'Simpan Perusahaan'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput
          label="Nama Perusahaan"
          placeholder="cth. PT Sinar Makmur"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.company_name}
          required
        />

        <TextInput
          label="Keterangan / Jenis Usaha"
          placeholder="cth. Distributor sabun dan shampo"
          value={businessDesc}
          onChange={(e) => setBusinessDesc(e.target.value)}
        />

        <div className="field">
          <label className="field__label" htmlFor="select-product">
            Produk *
          </label>
          <div className="field__select-wrapper">
            <select
              id="select-product"
              className={`field__select ${errors.product_id ? 'field__select--error' : ''}`}
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              {loadingProducts ? (
                <option value="">Memuat produk...</option>
              ) : (
                products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))
              )}
            </select>
          </div>
          {errors.product_id && <span className="field__error">{errors.product_id}</span>}
        </div>

        <TextInput
          label="Jumlah Tagihan (Rp)"
          inputType="number"
          placeholder="cth. 15000000"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          error={errors.total_amount}
          required
        />

        <TextInput
          label="Jatuh Tempo"
          inputType="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.due_date}
          required
        />

        <div className="field">
          <label className="field__label" htmlFor="select-status">
            Status Pembayaran *
          </label>
          <div className="field__select-wrapper">
            <select
              id="select-status"
              className={`field__select ${errors.status ? 'field__select--error' : ''}`}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              required
            >
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Cicilan">Cicilan</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
          {errors.status && <span className="field__error">{errors.status}</span>}
        </div>
      </form>
    </Modal>
  );
};
