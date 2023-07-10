# Submission Open Music API V2
- ### Kriteria 1 : Registrasi dan Autentikasi Pengguna ✅
- ### Kriteria 2 : Pengelolaan Data Playlist ✅
- ### Kriteria 3 : Menerapkan Foreign Key ✅
- ### Kriteria 4 : Menerapkan Data Validation ✅
- ### Kriteria 5 : Penanganan Eror (Error Handling) ✅
- ### Kriteria 6 : Pertahankan Fitur OpenMusic API versi 1 ✅
- ### Kriteria Opsional :
  - ### Kriteria 1 : Memiliki Fitur Kolaborator Playlist ✅
  - ### Kriteria 2 : Memiliki Fitur Playlist Activities ✅
  - ### Kriteria 3 : Mempertahankan Kriteria Opsional  OpenMusic versi 1 ✅

---
# Setup Node.js
- Klik *Terminal* -> *New Terminal*
- Ketik `npm init`
  * Setelah muncul **package name: (user)**, enter saja, jika sudah muncul pertanyaan **Is this OK? (yes)**, ketik `yes`
- Lalu ketik `npm install`, maka **package.json** dan **package-lock.json** akan muncul
- Pada **package.json**, ubah bagian script menjadi seperti ini:
  ```bash
   "scripts": {
    "start-prod": "NODE_ENV=production node ./src/server.js",
    "start": "node ./src/server.js",
    "migrate": "node-pg-migrate",
    "lint": "eslint ./src"
  },
  ```

---
# Setup dependencies
- Klik *Terminal* -> *New Terminal*
- Hapi framework: ketik `npm install @hapi/hapi`
- Hapi JWT: ketik `npm install @hapi/jwt`
- Auto-bind: ketik `npm i auto-bind@4`
- Bcrypt: ketik `npm install bcrypt`
- Dotenv: ketik `npm install dotenv`
- Joi: ketik `npm install joi`
- Nanoid: ketik `npm install nanoid@3.x.x`
- Node pg migrate: ketik `npm install node-pg-migrate`
- Pg: ketik `npm install pg`
- Eslint: ketik `npm install eslint --save-dev`, lalu ikuti instruksi berikut:
    * Ketik `npx eslint --init`, kemudian akan diberikan pertanyaan, jawab dengan jawaban berikut:
        * How would you like to use ESLint? -> To check, find problems, and enforce code style.
        * What type of modules does your project use? -> CommonJS (require/exports).
        * Which framework did you use? -> None of these. 
        * Does your project use TypeScript? -> No.
        * Where does your code run? -> Node.
        * How would you like to define a style for your project? -> Use a popular style guide.
        * Which style guide do you want to follow? -> (Anda bebas memilih, sebagai contoh saya pilih AirBnB).
        * What format do you want your config file to be in? -> JSON.
        * Would you like to install them now? -> Yes.
        * Which package manager do you want to use? -> npm.
    
* **NOTE**: saya tidak menggunakan nodemon, tetapi jika teman-teman ingin menggunakannya, silahkan
