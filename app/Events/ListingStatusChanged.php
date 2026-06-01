<?php

namespace App\Events;

use App\Models\Listing;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ListingStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Listing $listing,
        public string  $status,  // approved | rejected
    ) {}

    public function broadcastOn(): array
    {
        // Chỉ user sở hữu tin mới nhận được
        return [
            new PrivateChannel('user.' . $this->listing->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'listing.status.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'listing_id'    => $this->listing->id,
            'listing_title' => $this->listing->title,
            'status'        => $this->status,
            'message'       => $this->status === 'active'
                ? "Tin \"{$this->listing->title}\" đã được duyệt!"
                : "Tin \"{$this->listing->title}\" đã bị từ chối.",
        ];
    }
}