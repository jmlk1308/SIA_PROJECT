<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('courses', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->string('file_path')->nullable();  // For the banner image
        $table->string('theme_color')->default('#3182ce'); // ✅ The missing column
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('courses');
}

    
};
