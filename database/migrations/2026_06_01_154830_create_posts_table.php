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
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('post_category_id')->nullable()
              ->constrained()->nullOnDelete();
        $table->string('title');
        $table->string('slug')->unique();
        $table->text('excerpt')->nullable();
        // Tóm tắt ngắn hiển thị ở danh sách
        $table->longText('content');
        $table->string('thumbnail')->nullable();
        $table->enum('status', ['draft', 'published'])->default('draft');
        $table->boolean('is_featured')->default(false);
        $table->integer('view_count')->default(0);
        $table->json('tags')->nullable();
        $table->string('seo_title')->nullable();
        $table->text('seo_description')->nullable();
        $table->timestamp('published_at')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
