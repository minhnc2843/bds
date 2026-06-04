<?php

namespace Tests\Feature;

use App\Events\ListingStatusChanged;
use App\Events\NewListingSubmitted;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\Notification;
use App\Models\Promotion;
use App\Models\Province;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiFunctionalityTest extends TestCase
{
    use RefreshDatabase;

    public function test_auth_register_login_me_logout_and_banned_user_flow(): void
    {
        $registerResponse = $this->postJson('/api/auth/register', [
            'name' => 'Nguyen Van A',
            'email' => 'a@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'phone' => '0901234567',
        ]);

        $registerResponse
            ->assertCreated()
            ->assertJsonStructure(['message', 'token', 'user' => ['id', 'name', 'email']]);

        $this->assertTrue(Hash::check('secret123', User::where('email', 'a@example.com')->first()->password));

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'a@example.com',
            'password' => 'secret123',
        ]);

        $token = $loginResponse->assertOk()->json('token');

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'a@example.com');

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $user = User::where('email', 'a@example.com')->first();
        $user->update(['banned_at' => now()]);

        $this->postJson('/api/auth/login', [
            'email' => 'a@example.com',
            'password' => 'secret123',
        ])->assertForbidden();
    }

    public function test_public_catalog_site_config_and_listing_filters(): void
    {
        [$category, $province] = $this->createCategoryAndProvince();
        $otherProvince = Province::create(['name' => 'Da Nang', 'slug' => 'da-nang']);
        $user = User::factory()->create();

        SiteSetting::create([
            'key' => 'site_name',
            'value' => 'BDS Viet',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Site name',
        ]);

        Banner::create([
            'title' => 'Hero',
            'image_path' => 'banners/hero.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        Banner::create([
            'title' => 'Hidden',
            'image_path' => 'banners/hidden.jpg',
            'order' => 1,
            'is_active' => false,
        ]);

        Promotion::create([
            'title' => 'Hot deal',
            'order' => 1,
            'is_active' => true,
            'started_at' => now()->subDay(),
            'ended_at' => now()->addDay(),
        ]);

        Listing::create($this->listingPayload($user, $category, $province, [
            'title' => 'Can ho Quan 1',
            'status' => 'active',
            'type' => 'sale',
            'price' => 2000000000,
        ]));

        Listing::create($this->listingPayload($user, $category, $otherProvince, [
            'title' => 'Tin cho thue',
            'status' => 'pending',
            'type' => 'rent',
            'price' => 10000000,
        ]));

        $this->getJson('/api/categories')->assertOk()->assertJsonCount(1);
        $this->getJson('/api/provinces')->assertOk()->assertJsonCount(2);

        $this->getJson('/api/site/config')
            ->assertOk()
            ->assertJsonPath('general.site_name', 'BDS Viet')
            ->assertJsonCount(1, 'banners')
            ->assertJsonCount(1, 'promotions');

        $this->getJson('/api/listings?type=sale&province_id='.$province->id.'&keyword=Quan')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Can ho Quan 1')
            ->assertJsonCount(1, 'data');
    }

    public function test_authenticated_user_can_manage_own_listings_and_profile(): void
    {
        Event::fake([NewListingSubmitted::class]);
        [$category, $province] = $this->createCategoryAndProvince();
        $user = User::factory()->create(['password' => 'password']);
        Sanctum::actingAs($user);

        $createResponse = $this->postJson('/api/listings', $this->listingRequestPayload($category, $province, [
            'title' => 'Tin moi can duyet',
        ]));

        $listingId = $createResponse
            ->assertCreated()
            ->assertJsonPath('listing.status', 'pending')
            ->json('listing.id');

        Event::assertDispatched(NewListingSubmitted::class);

        $this->getJson('/api/my-listings')
            ->assertOk()
            ->assertJsonPath('data.0.id', $listingId);

        $this->putJson("/api/listings/{$listingId}", $this->listingRequestPayload($category, $province, [
            'title' => 'Tin da cap nhat',
        ]))
            ->assertOk()
            ->assertJsonPath('listing.title', 'Tin da cap nhat');

        $this->putJson('/api/profile', [
            'name' => 'Updated Name',
            'phone' => '0987654321',
        ])
            ->assertOk()
            ->assertJsonPath('user.name', 'Updated Name');

        $this->putJson('/api/profile/password', [
            'current_password' => 'password',
            'password' => 'newsecret',
            'password_confirmation' => 'newsecret',
        ])->assertOk();

        $this->assertTrue(Hash::check('newsecret', $user->fresh()->password));
    }

    public function test_listing_image_delete_and_owner_authorization(): void
    {
        Storage::fake('public');
        [$category, $province] = $this->createCategoryAndProvince();
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $listing = Listing::create($this->listingPayload($owner, $category, $province));
        $image = ListingImage::create([
            'listing_id' => $listing->id,
            'image_path' => 'listings/1/photo.jpg',
            'is_primary' => true,
        ]);

        Storage::disk('public')->put($image->image_path, 'fake image');

        Sanctum::actingAs($otherUser);
        $this->deleteJson("/api/listings/{$listing->id}/images/{$image->id}")
            ->assertNotFound();

        Sanctum::actingAs($owner);
        $this->deleteJson("/api/listings/{$listing->id}/images/{$image->id}")
            ->assertOk();

        $this->assertDatabaseMissing('listing_images', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($image->image_path);
    }

    public function test_admin_can_moderate_listings_manage_users_and_notifications(): void
    {
        Event::fake([ListingStatusChanged::class]);
        [$category, $province] = $this->createCategoryAndProvince();
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);
        $listing = Listing::create($this->listingPayload($user, $category, $province, [
            'status' => 'pending',
        ]));

        Sanctum::actingAs($user);
        $this->getJson('/api/admin/dashboard')->assertForbidden();

        Sanctum::actingAs($admin);
        $this->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('pending_listings', 1);

        $this->patchJson("/api/admin/listings/{$listing->id}/approve")
            ->assertOk()
            ->assertJsonPath('listing.status', 'active');

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'listing_approved',
        ]);

        Event::assertDispatched(ListingStatusChanged::class);

        Sanctum::actingAs($user);
        $notificationId = Notification::where('user_id', $user->id)->first()->id;

        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('unread_count', 1);

        $this->patchJson("/api/notifications/{$notificationId}/read")->assertOk();
        $this->patchJson('/api/notifications/read-all')->assertOk();
        $this->deleteJson("/api/notifications/{$notificationId}")->assertOk();

        Sanctum::actingAs($admin);
        $this->patchJson("/api/admin/users/{$user->id}/role", ['role' => 'admin'])
            ->assertOk()
            ->assertJsonPath('user.role', 'admin');

        $this->patchJson("/api/admin/users/{$user->id}/toggle-ban")->assertOk();
        $this->assertNotNull($user->fresh()->banned_at);
    }

    public function test_admin_can_manage_site_settings_banners_and_promotions(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        SiteSetting::create([
            'key' => 'site_name',
            'value' => 'Old name',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Site name',
        ]);

        SiteSetting::create([
            'key' => 'site_logo',
            'value' => null,
            'type' => 'image',
            'group' => 'general',
            'label' => 'Logo',
        ]);

        $this->putJson('/api/admin/settings', [
            'settings' => [
                ['key' => 'site_name', 'value' => 'New name'],
            ],
        ])->assertOk();

        $this->post('/api/admin/settings/upload-image', [
            'key' => 'site_logo',
            'image' => UploadedFile::fake()->image('logo.png'),
        ])->assertOk()->assertJsonStructure(['path', 'url']);

        $bannerResponse = $this->post('/api/admin/banners', [
            'title' => 'Top banner',
            'subtitle' => 'Subtitle',
            'image' => UploadedFile::fake()->image('banner.jpg'),
            'order' => 5,
        ]);

        $bannerId = $bannerResponse->assertCreated()->json('banner.id');

        $this->postJson('/api/admin/banners/reorder', [
            'orders' => [
                ['id' => $bannerId, 'order' => 1],
            ],
        ])->assertOk();

        $promotionResponse = $this->post('/api/admin/promotions', [
            'title' => 'Promo',
            'description' => 'Promotion description',
            'badge_text' => 'HOT',
            'image' => UploadedFile::fake()->image('promo.jpg'),
            'started_at' => now()->subDay()->toDateTimeString(),
            'ended_at' => now()->addDay()->toDateTimeString(),
        ]);

        $promotionId = $promotionResponse->assertCreated()->json('promotion.id');

        $this->getJson('/api/admin/banners')->assertOk()->assertJsonCount(1);
        $this->getJson('/api/admin/promotions')->assertOk()->assertJsonCount(1);
        $this->deleteJson("/api/admin/promotions/{$promotionId}")->assertOk();
        $this->deleteJson("/api/admin/banners/{$bannerId}")->assertOk();
    }

    private function createCategoryAndProvince(): array
    {
        return [
            Category::create(['name' => 'Can ho', 'slug' => 'can-ho']),
            Province::create(['name' => 'TP HCM', 'slug' => 'tp-hcm']),
        ];
    }

    private function listingRequestPayload(Category $category, Province $province, array $overrides = []): array
    {
        return array_merge([
            'category_id' => $category->id,
            'province_id' => $province->id,
            'title' => 'Can ho mau',
            'description' => 'Mo ta chi tiet can ho',
            'type' => 'sale',
            'price' => 1500000000,
            'area' => 70,
            'address' => '123 Nguyen Trai',
            'district' => 'Quan 1',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'floor' => 10,
            'contact_name' => 'Nguyen Van A',
            'contact_phone' => '0901234567',
        ], $overrides);
    }

    private function listingPayload(User $user, Category $category, Province $province, array $overrides = []): array
    {
        return array_merge($this->listingRequestPayload($category, $province), [
            'user_id' => $user->id,
            'status' => 'active',
            'expired_at' => now()->addDays(30),
        ], $overrides);
    }
}
