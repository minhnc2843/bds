<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Meilisearch\Client;

class SetupMeilisearch extends Command
{
    protected $signature   = 'meilisearch:setup';
    protected $description = 'Cấu hình index settings cho Meilisearch';

    public function handle(): void
    {
        $client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key')
        );

        $index = $client->index('listings');

        // Các field có thể tìm kiếm full-text
        $index->updateSearchableAttributes([
            'title',
            'description',
            'address',
            'district',
        ]);

        // Các field có thể filter/facet
        $index->updateFilterableAttributes([
            'type',
            'status',
            'price',
            'area',
            'bedrooms',
            'bathrooms',
            'category_id',
            'province_id',
        ]);

        // Các field có thể sort
        $index->updateSortableAttributes([
            'price',
            'area',
            'created_at',
        ]);

        // Cấu hình ranking (ưu tiên tìm kiếm)
        $index->updateRankingRules([
            'words',
            'typo',
            'proximity',
            'attribute',
            'sort',
            'exactness',
        ]);

        $this->info('✅ Meilisearch index settings đã được cấu hình!');
    }
}