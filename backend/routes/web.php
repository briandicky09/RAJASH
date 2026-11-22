<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $spaPath = public_path('spa.html');

    if (file_exists($spaPath)) {
        return response()->file($spaPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }

    return view('welcome');
})->where('any', '^(?!api(?:/|$)|up(?:/|$)|storage(?:/|$)).*$');
