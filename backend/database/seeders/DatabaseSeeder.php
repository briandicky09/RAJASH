<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\Income;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Pemilik (Owner UMKM RAJASH)
        $owner = User::firstOrCreate(
            ['username' => 'owner.rajash'],
            [
                'name' => 'Dedy Darmansyah',
                'email' => 'dedy@rajash-depot.id',
                'password' => Hash::make('rajash2026'),
                'role' => 'Owner UMKM RAJASH',
                'location' => 'Jln. Lamreung No. 16, Simpang Tujoeh, Ulee Kareng, Banda Aceh',
            ]
        );

        // 2. Data Pemasukan Awal
        $incomesData = [
            [
                'id' => 'INC-20261110-01',
                'date' => '2026-11-10',
                'customer_name' => 'Warkop Kupi Khop Ulee Kareng',
                'water_type' => 'Air Mineral',
                'quantity' => 15,
                'unit_price' => 6000,
                'amount' => 90000,
                'payment_method' => 'Tunai',
                'status' => 'Lunas',
                'description' => 'Pengantaran 15 galon isi ulang via becak pagi',
            ],
            [
                'id' => 'INC-20261110-02',
                'date' => '2026-11-10',
                'customer_name' => 'Rumah Makan Kari Kambing Pak Hasan',
                'water_type' => 'Air Mineral',
                'quantity' => 25,
                'unit_price' => 6000,
                'amount' => 150000,
                'payment_method' => 'Kredit',
                'status' => 'Belum Lunas',
                'description' => 'Pemesanan WhatsApp 25 galon isi ulang',
            ],
            [
                'id' => 'INC-20261110-03',
                'date' => '2026-11-10',
                'customer_name' => 'Pelanggan Depot Langsung',
                'water_type' => 'Air RO',
                'quantity' => 12,
                'unit_price' => 7000,
                'amount' => 84000,
                'payment_method' => 'Tunai',
                'status' => 'Lunas',
                'description' => 'Penjualan langsung di depot (12 galon air RO eceran)',
            ],
            [
                'id' => 'INC-20261109-01',
                'date' => '2026-11-09',
                'customer_name' => 'Asrama Mahasiswa Darussalam',
                'water_type' => 'Air Mineral',
                'quantity' => 30,
                'unit_price' => 6000,
                'amount' => 180000,
                'payment_method' => 'Kredit',
                'status' => 'Belum Lunas',
                'description' => 'Langganan mingguan 30 galon air minum',
            ],
            [
                'id' => 'INC-20261109-02',
                'date' => '2026-11-09',
                'customer_name' => 'Kedai Mie Aceh Simpang Tujuh',
                'water_type' => 'Air RO',
                'quantity' => 10,
                'unit_price' => 7000,
                'amount' => 70000,
                'payment_method' => 'Tunai',
                'status' => 'Lunas',
                'description' => 'Pengantaran sore 10 galon air RO',
            ],
            [
                'id' => 'INC-20261108-01',
                'date' => '2026-11-08',
                'customer_name' => 'Katering Ibu Cut Meutia',
                'water_type' => 'Air RO',
                'quantity' => 20,
                'unit_price' => 7000,
                'amount' => 140000,
                'payment_method' => 'Kredit',
                'status' => 'Belum Lunas',
                'description' => 'Pesanan katering kenduri 20 galon RO',
            ],
            [
                'id' => 'INC-20261108-02',
                'date' => '2026-11-08',
                'customer_name' => 'Kost Putri Krueng Cut',
                'water_type' => 'Air Mineral',
                'quantity' => 18,
                'unit_price' => 6000,
                'amount' => 108000,
                'payment_method' => 'Tunai',
                'status' => 'Lunas',
                'description' => 'Pengantaran becak sore untuk penghuni kost',
            ],
            [
                'id' => 'INC-20261107-01',
                'date' => '2026-11-07',
                'customer_name' => 'Toko Kelontong Bang Joni',
                'water_type' => 'Air Mineral',
                'quantity' => 20,
                'unit_price' => 6000,
                'amount' => 120000,
                'payment_method' => 'Tunai',
                'status' => 'Lunas',
                'description' => 'Titipan stok galon toko kelontong',
            ],
            [
                'id' => 'INC-20261106-01',
                'date' => '2026-11-06',
                'customer_name' => 'Dayah Mini Al-Ikhlas Pango',
                'water_type' => 'Air Mineral',
                'quantity' => 40,
                'unit_price' => 6000,
                'amount' => 240000,
                'payment_method' => 'Kredit',
                'status' => 'Belum Lunas',
                'description' => 'Pasokan mingguan santri dayah 40 galon',
            ],
        ];

        foreach ($incomesData as $item) {
            Income::updateOrCreate(['id' => $item['id']], $item);
        }

        // 3. Data Pengeluaran Operasional (FR-04: 6 Kategori)
        $expensesData = [
            [
                'id' => 'EXP-20261110-01',
                'date' => '2026-11-10',
                'category' => 'BBM Becak',
                'raw_jenis' => 'BBM Becak',
                'amount' => 35000,
                'description' => 'Pengisian Pertalite becak pengantar pagi & siang',
                'data_source' => 'application',
            ],
            [
                'id' => 'EXP-20261109-01',
                'date' => '2026-11-09',
                'category' => 'Pembelian Pasokan Air',
                'raw_jenis' => 'Pembelian Pasokan Air',
                'amount' => 250000,
                'description' => 'Pengisian tangki utama air baku pegunungan (1 tangki)',
                'data_source' => 'application',
            ],
            [
                'id' => 'EXP-20261108-01',
                'date' => '2026-11-08',
                'category' => 'Servis Kendaraan',
                'raw_jenis' => 'Servis Kendaraan',
                'amount' => 75000,
                'description' => 'Penyetelan rem dan rantai becak motor pengangkut',
                'data_source' => 'application',
            ],
            [
                'id' => 'EXP-20261107-01',
                'date' => '2026-11-07',
                'category' => 'Penggantian Oli',
                'raw_jenis' => 'Penggantian Oli',
                'amount' => 45000,
                'description' => 'Penggantian oli mesin berkala armada becak',
                'data_source' => 'application',
            ],
            [
                'id' => 'EXP-20261106-01',
                'date' => '2026-11-06',
                'category' => 'Perbaikan Ban',
                'raw_jenis' => 'Perbaikan Ban',
                'amount' => 25000,
                'description' => 'Tambal ban dalam becak bagian kiri karena paku',
                'data_source' => 'application',
            ],
        ];

        foreach ($expensesData as $item) {
            Expense::updateOrCreate(['id' => $item['id']], $item);
        }

        // 4. Data Piutang & Pembayaran Bertahap (FR-05)
        $receivablesData = [
            [
                'id' => 'RCV-20261110-01',
                'income_id' => 'INC-20261110-02',
                'customer_name' => 'Rumah Makan Kari Kambing Pak Hasan',
                'transaction_date' => '2026-11-10',
                'date' => '2026-11-10',
                'total_amount' => 150000,
                'paid_amount' => 0,
                'remaining_amount' => 150000,
                'status' => 'Belum Lunas',
                'description' => 'Pemesanan WhatsApp 25 galon isi ulang',
                'payments' => [],
            ],
            [
                'id' => 'RCV-20261109-01',
                'income_id' => 'INC-20261109-01',
                'customer_name' => 'Asrama Mahasiswa Darussalam',
                'transaction_date' => '2026-11-09',
                'date' => '2026-11-09',
                'total_amount' => 180000,
                'paid_amount' => 80000,
                'remaining_amount' => 100000,
                'status' => 'Belum Lunas',
                'description' => 'Langganan mingguan 30 galon air minum',
                'payments' => [
                    [
                        'id' => 'PAY-20261110-01',
                        'payment_date' => '2026-11-10',
                        'date' => '2026-11-10',
                        'amount' => 80000,
                        'note' => 'Pembayaran cicilan pertama tunai saat antar pesanan sore',
                    ],
                ],
            ],
            [
                'id' => 'RCV-20261108-01',
                'income_id' => 'INC-20261108-01',
                'customer_name' => 'Katering Ibu Cut Meutia',
                'transaction_date' => '2026-11-08',
                'date' => '2026-11-08',
                'total_amount' => 140000,
                'paid_amount' => 140000,
                'remaining_amount' => 0,
                'status' => 'Lunas',
                'description' => 'Pesanan katering kenduri 20 galon RO',
                'payments' => [
                    [
                        'id' => 'PAY-20261109-01',
                        'payment_date' => '2026-11-09',
                        'date' => '2026-11-09',
                        'amount' => 140000,
                        'note' => 'Pelunasan penuh transfer bank saat acara selesai',
                    ],
                ],
            ],
            [
                'id' => 'RCV-20261106-01',
                'income_id' => 'INC-20261106-01',
                'customer_name' => 'Dayah Mini Al-Ikhlas Pango',
                'transaction_date' => '2026-11-06',
                'date' => '2026-11-06',
                'total_amount' => 240000,
                'paid_amount' => 40000,
                'remaining_amount' => 200000,
                'status' => 'Belum Lunas',
                'description' => 'Pasokan mingguan santri dayah 40 galon',
                'payments' => [
                    [
                        'id' => 'PAY-20261108-01',
                        'payment_date' => '2026-11-08',
                        'date' => '2026-11-08',
                        'amount' => 40000,
                        'note' => 'Titipan uang muka saat antar galon',
                    ],
                ],
            ],
        ];

        foreach ($receivablesData as $item) {
            $payments = $item['payments'];
            unset($item['payments']);

            $receivable = Receivable::updateOrCreate(['id' => $item['id']], $item);

            foreach ($payments as $pay) {
                $pay['receivable_id'] = $receivable->id;
                ReceivablePayment::updateOrCreate(['id' => $pay['id']], $pay);
            }
        }
    }
}
