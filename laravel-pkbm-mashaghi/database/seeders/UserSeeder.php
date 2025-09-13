<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Bunga Suci Haqiqi',
            'username' => 'BungaSuci',
            'email' => 'klein@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111111',
            'nisn' => null,
            'nik' => '3276012309871001',
            'tanggal_lahir' => '1987-09-23',
            'role' => 'kepalaSekolah',
            'kelas_id' => null,
        ]);

        User::create([
            'name' => 'Daly Simon',
            'username' => 'tu_daly',
            'email' => 'daly@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111112',
            'nisn' => null,
            'nik' => '3276012309871002',
            'tanggal_lahir' => '1985-03-15',
            'role' => 'tenagaPendidik',
            'kelas_id' => null,
        ]);

        User::create([
            'name' => 'Staff Admin 1',
            'username' => 'staff01',
            'email' => 'staff01@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111113',
            'nisn' => null,
            'nik' => '3276012309871003',
            'tanggal_lahir' => '1990-01-15',
            'role' => 'tenagaPendidik',
            'kelas_id' => null,
        ]);

        User::create([
            'name' => 'Staff Admin 2',
            'username' => 'staff02',
            'email' => 'staff02@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111114',
            'nisn' => null,
            'nik' => '3276012309871004',
            'tanggal_lahir' => '1988-05-22',
            'role' => 'tenagaPendidik',
            'kelas_id' => null,
        ]);

        $guru1 = User::create([
            'name' => 'Roselle Gustav',
            'username' => 'guru_roselle',
            'email' => 'roselle@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111115',
            'nisn' => null,
            'nik' => '3276012309871005',
            'tanggal_lahir' => '1985-07-10',
            'role' => 'guru',
            'absensi_guruTendik' => true,
        ]);
        $guru1->mapels()->attach([1, 2]);
        $guru1->kelasMengajar()->attach([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        $guru2 = User::create([
            'name' => 'Zaratul',
            'username' => 'guru_zaratul',
            'email' => 'zaratul@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111116',
            'nisn' => null,
            'nik' => '3276012309871006',
            'tanggal_lahir' => '1982-11-30',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru2->mapels()->attach([3]);

        $guru3 = User::create([
            'name' => 'Hermes',
            'username' => 'guru_hermes',
            'email' => 'hermes@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111117',
            'nisn' => null,
            'nik' => '3276012309871007',
            'tanggal_lahir' => '1979-04-18',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru3->mapels()->attach([4, 5]);

        User::create([
            'name' => 'Abdul Malik Ibrahim',
            'username' => 'AbdulMalik001',
            'email' => 'AbdulMalik@gmail.com',
            'password' => Hash::make('4bduLm4l1k'),
            'no_wa' => '',
            'nisn' => '3109890888',
            'nik' => null,
            'tanggal_lahir' => '2010-02-11',
            'role' => 'pesertaDidik',
            'kelas_id' => 5,
        ]);

        User::create([
            'name' => 'Abdurrohman Faris',
            'username' => 'Abdurrohman002',
            'email' => 'Abdurrohman2@gmail.com',
            'password' => Hash::make('4bduRr0hm4n'),
            'no_wa' => null,
            'nisn' => '3093231680',
            'nik' => null,
            'tanggal_lahir' => '2009-08-04',
            'role' => 'pesertaDidik',
            'kelas_id' => 6,
        ]);

        User::create([
            'name' => 'ABDURROHMAN HAMID ASH SHIDDIQY',
            'username' => 'Abdurrohman003',
            'email' => 'Abdurrohman3@gmail.com',
            'password' => Hash::make('4bduRr0hm4n'),
            'no_wa' => null,
            'nisn' => '3172928621',
            'nik' => null,
            'tanggal_lahir' => '2017-12-04',
            'role' => 'pesertaDidik',
            'kelas_id' => 2,
        ]);

        User::create([
            'name' => 'ABI OBAMA',
            'username' => 'AbiObama004',
            'email' => 'AbiObama004@gmail.com',
            'password' => Hash::make('4b10b4m4'),
            'no_wa' => "088294408983",
            'nisn' => '0084666190',
            'nik' => null,
            'tanggal_lahir' => '2008-11-01',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);

        User::create([
            'name' => 'ABIYYAH KAYLA PUTRI	',
            'username' => 'Abiyah005',
            'email' => 'Abiyah005@gmail.com',
            'password' => Hash::make('4b1y4hK4y14'),
            'no_wa' => null,
            'nisn' => '0136714085',
            'nik' => null,
            'tanggal_lahir' => '2013-05-17',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);

        User::create([
            'name' => 'ACHMAT GAHRU FIRDAUS',
            'username' => 'Achmat006',
            'email' => 'Achmat006@gmail.com',
            'password' => Hash::make('4chm4tG4hr4'),
            'no_wa' => '082100000006',
            'nisn' => '0079325890',
            'nik' => null,
            'tanggal_lahir' => '2007-09-09',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);

        User::create([
            'name' => 'ADAM REGIS FADHLURRAHMAN SALSABILA',
            'username' => 'AdamRegis007',
            'email' => 'AdamRegis007@gmail.com',
            'password' => Hash::make('4d4mR3g1sF4dhlu'),
            'no_wa' => '',
            'nisn' => '0045079493',
            'nik' => null,
            'tanggal_lahir' => '2004-02-03',
            'role' => 'pesertaDidik',
            'kelas_id' => 9,
        ]);

        User::create([
            'name' => 'ADI ABDU RAZAQ',
            'username' => 'AdiAbduRazaq008',
            'email' => 'AdiAbduRazaq008@gmail.com',
            'password' => Hash::make('4d1Abd4R4z4q'),
            'no_wa' => null,
            'nisn' => '0053422831',
            'nik' => null,
            'tanggal_lahir' => '2005-04-16',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);

        User::create([
            'name' => 'ADITIA AKTAVIANSYAH',
            'username' => 'Aditia009',
            'email' => 'Aditia009@gmail.com',
            'password' => Hash::make('4d1t1a9kT4v1ansyah'),
            'no_wa' => null,
            'nisn' => '0027696052',
            'nik' => null,
            'tanggal_lahir' => '2001-10-03',
            'role' => 'pesertaDidik',
            'kelas_id' => 6,
        ]);

        User::create([
            'name' => 'ADRIAN MAULANA',
            'username' => 'Adrian010',
            'email' => 'Adrian010@gmail.com',
            'password' => Hash::make('4dr1anM4ul4n4'),
            'no_wa' => null,
            'nisn' => '0059425587',
            'nik' => null,
            'tanggal_lahir' => '2005-07-02',
            'role' => 'pesertaDidik',
            'kelas_id' => 9,
        ]);

        User::create([
            'name' => 'ADZKIA QISTHI KHALILAH',
            'username' => 'Adzkia011',
            'email' => 'Adzkia011@gmail.com',
            'password' => Hash::make('4dzk1aQ1sth1K4hl1l4h'),
            'no_wa' => null,
            'nisn' => '3168275226',
            'nik' => null,
            'tanggal_lahir' => '2016-01-20',
            'role' => 'pesertaDidik',
            'kelas_id' => 2,
        ]);
   
        User::create([
            'name' => 'ADZKIYA SILMI AFIKA',
            'username' => 'Adzkiya012',
            'email' => 'Adzkiya012@gmail.com',
            'password' => Hash::make(''),
            'no_wa' => null,
            'nisn' => '3195029404',
            'nik' => null,
            'tanggal_lahir' => '2019-09-15',
            'role' => 'pesertaDidik',
            'kelas_id' => 1,
        ]);

        
        User::create([
            'name' => 'AENUN NADIFAH',
            'username' => 'Aenun',
            'email' => 'Aenun@gmail.com',
            'password' => Hash::make('4d3nUnN4d1f4h'),
            'no_wa' => null,
            'nisn' => '0142552200',
            'nik' => null,
            'tanggal_lahir' => '2014-06-15',
            'role' => 'pesertaDidik',
            'kelas_id' => 2,
        ]);

        
        User::create([
            'name' => 'Agus Tiar Ramadan',
            'username' => 'AgusTiar',
            'email' => 'AgusTiar@gmail.com',
            'password' => Hash::make('4gusT1arR4m4dh4n'),
            'no_wa' => null,
            'nisn' => '3117896898',
            'nik' => null,
            'tanggal_lahir' => '2011-08-16',
            'role' => 'pesertaDidik',
            'kelas_id' => 3,
        ]);


        User::create([
            'name' => 'AHMAD ANWAR ARRASYID',
            'username' => 'AhmadAnwar',
            'email' => 'AhmadAnwar@gmail.com',
            'password' => Hash::make('4hmad4nw4rr4sy1d'),
            'no_wa' => null,
            'nisn' => '3083761074',
            'nik' => null,
            'tanggal_lahir' => '2008-05-09',
            'role' => 'pesertaDidik',
            'kelas_id' => 7,
        ]);

        
        User::create([
            'name' => 'AISYAH',
            'username' => 'Aisyah',
            'email' => 'Aisyah@gmail.com',
            'password' => Hash::make('4isy4hRM4n4h'),
            'no_wa' => null,
            'nisn' => '0084874966',
            'nik' => null,
            'tanggal_lahir' => '2008-08-09',
            'role' => 'pesertaDidik',
            'kelas_id' => 5,
        ]);

        User::create([
            'name' => 'ALDI',
            'username' => 'Aldikece09',
            'email' => 'Aldikece09@gmail.com',
            'password' => Hash::make('4ld1k3ce09'),
            'no_wa' => '088601152051',
            'nisn' => '3085501383',
            'nik' => null,
            'tanggal_lahir' => '2008-10-07',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);

        
        User::create([
            'name' => 'AMELIA IRYANTI',
            'username' => 'Amelia0811',
            'email' => 'Amelia0821@gmail.com',
            'password' => Hash::make('4mel1a0821'),
            'no_wa' => "085750314451",
            'nisn' => '0034907781',
            'nik' => null,
            'tanggal_lahir' => '2003-03-04',
            'role' => 'pesertaDidik',
            'kelas_id' => 9,
        ]);

        User::create([
            'name' => 'ARIF WICAKSONO',
            'username' => 'Arifwicak0101',
            'email' => 'Arifwicak0101@gmail.com',
            'password' => Hash::make('4rifw1cak0101'),
            'no_wa' => null,
            'nisn' => '3972166271',
            'nik' => null,
            'tanggal_lahir' => '1997-12-26',
            'role' => 'pesertaDidik',
            'kelas_id' => 9,
        ]);

        
        User::create([
            'name' => 'Aurelia Salsabila Putri',
            'username' => 'Aurelia098',
            'email' => 'Aurelia098@gmail.com',
            'password' => Hash::make('4urel1a098'),
            'no_wa' => "081908961981",
            'nisn' => '3193243933',
            'nik' => null,
            'tanggal_lahir' => '2019-03-11',
            'role' => 'pesertaDidik',
            'kelas_id' => 1,
        ]);

        
        
        User::create([
            'name' => 'BELA INDAH GUNAWAN',
            'username' => 'BelaIndah007',
            'email' => 'BelaIndah007@gmail.com',
            'password' => Hash::make('B3l4Indah007'),
            'no_wa' => "087872616325",
            'nisn' => '3174105169',
            'nik' => null,
            'tanggal_lahir' => '2017-10-07',
            'role' => 'pesertaDidik',
            'kelas_id' => 8,
        ]);



        

    }
}