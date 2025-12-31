<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('courses', function (Blueprint $table) {
        // Check if column exists to avoid errors
        if (!Schema::hasColumn('courses', 'theme_color')) {
            $table->string('theme_color')->default('#3182ce')->nullable();
        }
    });
}

public function down()
{
    Schema::table('courses', function (Blueprint $table) {
        $table->dropColumn('theme_color');
    });
}
};