<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('promotions', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->string('image_path')->nullable();
        $table->string('badge_text')->nullable();
        // VD: "HOT", "NEW", "-20%"
        $table->string('badge_color')->default('#C9A84C');
        $table->string('link')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamp('started_at')->nullable();
        $table->timestamp('ended_at')->nullable();
        $table->integer('order')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
