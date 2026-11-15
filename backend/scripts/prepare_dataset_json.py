import openpyxl
import os
import json
from datetime import datetime

data_dir = r"D:\Assignment\Dicoding\Asah 2026\Rajash\RAJASH\dataset\Data"
output_dir = r"D:\Assignment\Dicoding\Asah 2026\Rajash\RAJASH\backend\storage\app\import"
os.makedirs(output_dir, exist_ok=True)

CATEGORY_MAPPING = {
    "Minyak Becak": "BBM Becak",
    "Gaji Kevin (Karyawan)": "Gaji Karyawan",
    "Beli Token Listrik": "Listrik & PDAM",
    "Bayar PDAM": "Listrik & PDAM",
    "Beli Cok Listrik": "Listrik & PDAM",
    "Beli Bola Lampu 2 bh": "Listrik & PDAM",
    "Tempel Ban Becak": "Perbaikan Ban",
    "1 Ban Becak Dalam": "Perbaikan Ban",
    "Ganti Ban Becak": "Perbaikan Ban",
    "Perbaiki Dap Mesin Air": "Servis Kendaraan",
    "Perbaiki Mesin Pompa Air": "Servis Kendaraan",
    "Perbaiki Tapak Rem Becak dan Karet + Reng": "Servis Kendaraan",
    "Beli Tisu": "Operasional Depot",
    "Beli Tutup RO": "Operasional Depot",
    "Beli Saringan": "Operasional Depot",
    "Cuci Saringan Membran": "Operasional Depot",
    "Beli Stop Keran dan Lem Pipa": "Operasional Depot",
    "Beli Pembersih Gusi": "Operasional Depot",
    "Beli Saringan RO 5 bh": "Operasional Depot",
    "Beli Stop Keran Air 2 bh": "Operasional Depot",
    "Beli Tempat Saring Air": "Operasional Depot",
    "Minyak Genset": "Lainnya",
    "Bayar Angsuran Rumah": "Lainnya",
    "Sumbangan Maulid": "Lainnya",
    "Pinjaman": "Lainnya",
}

def parse_date(d):
    if isinstance(d, datetime):
        return d.strftime("%Y-%m-%d")
    return str(d)[:10]

# 1. PROCESS PEMASUKAN SINTETIS
wb_s = openpyxl.load_workbook(os.path.join(data_dir, "Data_Sintetis_Rajash.xlsx"), data_only=True)
ws_pem = wb_s["Pemasukan"]
rows_pem = list(ws_pem.iter_rows(values_only=True))
header_pem = rows_pem[0]

pemasukan_payload = {
    "batch_id": "BATCH-SYN-PEMASUKAN-2026",
    "filename": "Data_Sintetis_Rajash.xlsx",
    "sheet_name": "Pemasukan",
    "file_type": "pemasukan_sintetis",
    "data_source": "synthetic",
    "total_rows": len(rows_pem) - 1,
    "items_to_import": [],
    "items_skipped": []
}

for idx, r in enumerate(rows_pem[1:], start=2):
    tgl, nama, ro, bs, total, ket = r
    tgl_str = parse_date(tgl)
    nama_str = str(nama).strip() if nama is not None else ""
    ro_val = float(ro) if ro is not None else 0.0
    bs_val = float(bs) if bs is not None else 0.0
    total_val = float(total) if total is not None else 0.0
    ket_str = str(ket).strip() if ket is not None else "Sudah Bayar"

    raw_data = {
        "Tanggal_Pemesanan": tgl_str,
        "Nama_Pelanggan": nama_str,
        "RO_Jumlah": ro_val,
        "BS_Jumlah": bs_val,
        "Total": total_val,
        "Keterangan": ket_str
    }

    # Case 1: Kupon with 0 RO and 0 BS and 0 Total -> Skip
    if nama_str == "Kupon" and ro_val == 0.0 and bs_val == 0.0 and total_val == 0.0:
        pemasukan_payload["items_skipped"].append({
            "row_number": idx,
            "raw_data": raw_data,
            "reason": "Kupon tanpa penukaran galon (RO=0, BS=0, Total=Rp0)"
        })
    # Case 2: OTK with 0 RO and 0 BS and 0 Total -> Skip
    elif nama_str == "OTK" and ro_val == 0.0 and bs_val == 0.0 and total_val == 0.0:
        pemasukan_payload["items_skipped"].append({
            "row_number": idx,
            "raw_data": raw_data,
            "reason": "Pelanggan OTK tanpa transaksi pemesanan (RO=0, BS=0, Total=Rp0)"
        })
    # Case 3: Other customer with 0 RO and 0 BS and 0 Total -> Skip
    elif ro_val == 0.0 and bs_val == 0.0 and total_val == 0.0:
        pemasukan_payload["items_skipped"].append({
            "row_number": idx,
            "raw_data": raw_data,
            "reason": f"Placeholder harian pelanggan '{nama_str}' tanpa transaksi (RO=0, BS=0, Total=Rp0)"
        })
    # Case 4: Kupon with RO > 0 or BS > 0 -> Import with amount = 0
    elif nama_str == "Kupon":
        pemasukan_payload["items_to_import"].append({
            "row_number": idx,
            "date": tgl_str,
            "customer_name": "Kupon (Penukaran Gratis)",
            "raw_customer_name": "Kupon",
            "ro_quantity": ro_val,
            "bs_quantity": bs_val,
            "ro_price": 5000.0,
            "bs_price": 4000.0,
            "amount": 0.0,
            "payment_method": "Tunai",
            "status": "Lunas",
            "description": f"Penukaran Kupon Loyalitas Pelanggan (RO: {ro_val}, BS: {bs_val})",
            "data_source": "synthetic",
            "raw_reference": f"SYN-PEM-{idx}"
        })
    # Case 5: Regular transaction or OTK with Total > 0
    else:
        cust_display = "OTK (Pelanggan Depot)" if nama_str == "OTK" else nama_str
        is_credit = (ket_str == "Belum Bayar")
        pemasukan_payload["items_to_import"].append({
            "row_number": idx,
            "date": tgl_str,
            "customer_name": cust_display,
            "raw_customer_name": nama_str,
            "ro_quantity": ro_val,
            "bs_quantity": bs_val,
            "ro_price": 5000.0,
            "bs_price": 4000.0,
            "amount": total_val,
            "payment_method": "Kredit" if is_credit else "Tunai",
            "status": "Belum Lunas" if is_credit else "Lunas",
            "description": f"Pemesanan {nama_str} (RO: {ro_val}, BS: {bs_val})",
            "data_source": "synthetic",
            "raw_reference": f"SYN-PEM-{idx}"
        })

with open(os.path.join(output_dir, "pemasukan_sintetis.json"), "w", encoding="utf-8") as f:
    json.dump(pemasukan_payload, f, indent=2)

# 2. PROCESS PENGELUARAN SINTETIS
ws_peng_s = wb_s["Pengeluaran"]
rows_peng_s = list(ws_peng_s.iter_rows(values_only=True))

pengeluaran_s_payload = {
    "batch_id": "BATCH-SYN-PENGELUARAN-2026",
    "filename": "Data_Sintetis_Rajash.xlsx",
    "sheet_name": "Pengeluaran",
    "file_type": "pengeluaran_sintetis",
    "data_source": "synthetic",
    "total_rows": len(rows_peng_s) - 1,
    "items_to_import": [],
    "items_skipped": []
}

for idx, r in enumerate(rows_peng_s[1:], start=2):
    tgl, jenis, jlh = r
    tgl_str = parse_date(tgl)
    jenis_str = str(jenis).strip() if jenis is not None else ""
    jlh_val = float(jlh) if jlh is not None else 0.0

    raw_data = {
        "Tanggal_Pengeluaran": tgl_str,
        "Jenis_Pengeluaran": jenis_str,
        "Jumlah(Rp)": jlh_val
    }

    if jenis_str.lower() == "tidak ada" or jlh_val == 0.0:
        pengeluaran_s_payload["items_skipped"].append({
            "row_number": idx,
            "raw_data": raw_data,
            "reason": "Tidak ada transaksi pengeluaran pada tanggal ini (Jumlah = Rp0)"
        })
    else:
        category = CATEGORY_MAPPING.get(jenis_str, "Lainnya")
        pengeluaran_s_payload["items_to_import"].append({
            "row_number": idx,
            "date": tgl_str,
            "category": category,
            "raw_jenis": jenis_str,
            "amount": jlh_val,
            "description": jenis_str,
            "data_source": "synthetic",
            "raw_reference": f"SYN-EXP-{idx}"
        })

with open(os.path.join(output_dir, "pengeluaran_sintetis.json"), "w", encoding="utf-8") as f:
    json.dump(pengeluaran_s_payload, f, indent=2)

# 3. PROCESS PENGELUARAN REAL
wb_r = openpyxl.load_workbook(os.path.join(data_dir, "Dataset Pengeluaran-1.xlsx"), data_only=True)
ws_peng_r = wb_r["Sheet1"]
rows_peng_r = list(ws_peng_r.iter_rows(values_only=True))

pengeluaran_r_payload = {
    "batch_id": "BATCH-REAL-PENGELUARAN-2026",
    "filename": "Dataset Pengeluaran-1.xlsx",
    "sheet_name": "Sheet1",
    "file_type": "pengeluaran_real",
    "data_source": "real",
    "total_rows": len(rows_peng_r) - 1,
    "items_to_import": [],
    "items_skipped": []
}

for idx, r in enumerate(rows_peng_r[1:], start=2):
    tgl, jenis, jlh = r
    tgl_str = parse_date(tgl)
    jenis_str = str(jenis).strip() if jenis is not None else ""
    jlh_val = float(jlh) if jlh is not None else 0.0

    raw_data = {
        "Tanggal_Pengeluaran": tgl_str,
        "Jenis_Pengeluaran": jenis_str,
        "Jumlah(Rp)": jlh_val
    }

    if jenis_str.lower() == "tidak ada" or jlh_val == 0.0:
        pengeluaran_r_payload["items_skipped"].append({
            "row_number": idx,
            "raw_data": raw_data,
            "reason": "Tidak ada transaksi pengeluaran pada tanggal ini (Jumlah = Rp0)"
        })
    else:
        category = CATEGORY_MAPPING.get(jenis_str, "Lainnya")
        pengeluaran_r_payload["items_to_import"].append({
            "row_number": idx,
            "date": tgl_str,
            "category": category,
            "raw_jenis": jenis_str,
            "amount": jlh_val,
            "description": jenis_str,
            "data_source": "real",
            "raw_reference": f"REAL-EXP-{idx}"
        })

with open(os.path.join(output_dir, "pengeluaran_real.json"), "w", encoding="utf-8") as f:
    json.dump(pengeluaran_r_payload, f, indent=2)

print("JSON files prepared successfully:")
print("1. Pemasukan Sintetis:", len(pemasukan_payload["items_to_import"]), "items to import,", len(pemasukan_payload["items_skipped"]), "skipped.")
print("2. Pengeluaran Sintetis:", len(pengeluaran_s_payload["items_to_import"]), "items to import,", len(pengeluaran_s_payload["items_skipped"]), "skipped.")
print("3. Pengeluaran Real:", len(pengeluaran_r_payload["items_to_import"]), "items to import,", len(pengeluaran_r_payload["items_skipped"]), "skipped.")
