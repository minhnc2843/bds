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
    Schema::create('listings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('category_id')->constrained()->onDelete('cascade');
        $table->foreignId('province_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description');
        $table->enum('type', ['sale', 'rent']);   // mua/bán hoặc cho thuê
        $table->decimal('price', 15, 2);
        $table->decimal('area', 8, 2);            // diện tích m²
        $table->string('address');
        $table->string('district')->nullable();
        $table->integer('bedrooms')->default(0);
        $table->integer('bathrooms')->default(0);
        $table->integer('floor')->nullable();
        $table->string('contact_name');
        $table->string('contact_phone');
        $table->enum('status', ['pending', 'active', 'rejected', 'expired'])
              ->default('pending');
        $table->timestamp('expired_at')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
