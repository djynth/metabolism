<h2>Select a Game Mode</h2>

<div class="modes">
    <div class="mode freeplay" mode="<?= Game::MODE_FREE_PLAY ?>">
        <svg width="100%" height="100%" viewBox="0 0 13 13">
            <text x="-1" y="11">&#xf11b;</text>
        </svg>
        <div class="label">Free Play
            <ul class="details">
                <li>Standard game with no restrictions</li>
                <li>Score as many points as possible in a fixed number of turns</li>
            </ul>
        </div>
    </div>

    <div class="mode campaign" mode="<?= Game::MODE_CAMPAIGN ?>">
        <svg width="100%" height="100%" viewBox="0 0 13 13">
            <text x="-1" y="11.5">&#xf018;</text>
        </svg>
        <div class="label">Campaign
            <ul class="details">
                <li>Score points and survive through a randomly generated adventure</li>
                <li>Build and store resources for periodic challenges</li>
            </ul>
        </div>
    </div>

    <div class="mode challenge" mode="<?= Game::MODE_CHALLENGE ?>">
        <svg width="100%" height="100%" viewBox="0 0 15 15">
            <text x="1" y="12.5">&#xf091;</text>
        </svg>
        <div class="label">Challenge
            <ul class="details">
                <li>Meet challenge requirements in as few turns as possible</li>
                <li>Starting resources are changed and some pathways are restricted</li>
            </ul>
        </div>
    </div>
</div>

<div class="mode-info" mode="<?= Game::MODE_FREE_PLAY ?>">
    <button class="play btn large">Play</button>
    <h2 class="title">Free Play</h2>

    <h2 class="overview">Overview</h2>
    <ul>
        <li>Play a standard game in a fixed number of turns, scoring as many points as you can</li>
        <li>Maximum Turns: <?= Challenge::getFreePlay()->max_turns ?></li>
    </ul>

    <h2 class="pathway-restrictions">Pathway Restrictions</h2>
    <ul>
        <li>None; play with all the pathways</li>
    </ul>

    <h2 class="resource-restrictions">Resource Restrictions</h2>
    <ul>
        <li>Standard: keep resources within reasonable limits at the risk of losing points</li>
    </ul>

    <h2 class="goals">Goals</h2>
    <ul>
        <li>Score as many points as possible in whatever way is most convenient</li>
    </ul>
</div>

<div class="mode-info" mode="<?= Game::MODE_CAMPAIGN ?>">
    <button class="play btn large">Play</button>
    <h2 class="title">Campaign</h2>

    <h2 class="overview">Overview</h2>
    <ul>
        <li>Survive for as long as possible and score as many points as you can</li>
        <li>As you progress in your journey, random challenges of varying difficulty will be presented, forcing you to meet certain requirements in a given number of turns with the resources you have built up</li>
    </ul>

    <h2 class="pathway-restrictions">Pathway Restrictions</h2>
    <ul>
        <li>Varying; between challenges all pathways will be available, during challenges some pathways may be limited or disabled</li>
    </ul>

    <h2 class="resource-restrictions">Resource Restrictions</h2>
    <ul>
        <li>Varying: between challenges, keep resources within reasonable limits at the risk of losing points, during challenges, some resources may be more severely limited</li>
    </ul>

    <h2 class="goals">Goals</h2>
    <ul>
        <li>End the game with as many points as possible; to this end, survive as long as is viable</li>
    </ul>
</div>

<div class="mode-info" mode="<?= Game::MODE_CHALLENGE ?>">
    <button class="play btn large disabled">Play</button>
    <select class="btn large challenges title">
        <option value="-1">Select Challenge</option>
        <?php foreach(Challenge::getChallenges() as $challenge): ?>
            <option value="<?= $challenge->id ?>"><?= $challenge->name ?></option>
        <?php endforeach ?>
    </select>

    <h2 class="overview">Overview</h2>
    <ul>
        <li>Playing with certain starting resources and restrictions, meet the challenge goals in as few turns as possible</li>
        <li>Play as long as necessary with no limit on turns and no score total</li>
    </ul>

    <?php foreach(Challenge::getChallenges() as $challenge): ?>
        <div class="details" challenge="<?= $challenge->id ?>">
            <h2 class="pathway-restrictions">Pathway Restrictions</h2>
            <ul>
                <?php foreach ($challenge->restrictions as $restriction): ?>
                    <?php if (!$restriction->pathway->passive): ?>
                        <li><?= $restriction ?></li>
                    <?php endif ?>
                <?php endforeach ?>
            </ul>

            <h2 class="goals">Goals</h2>
            <ul>
                <?php foreach ($challenge->goals as $goal): ?>
                    <li><?= $goal ?></li>
                <?php endforeach ?>
            </ul>
        </div>
    <?php endforeach ?>
</div>